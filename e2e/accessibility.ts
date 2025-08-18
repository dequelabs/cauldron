import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';
import express from 'express';
import { AxeResults } from 'axe-core';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import PQueue from 'p-queue';
import { AddressInfo } from 'net';

const DIST_PATH = path.join(__dirname, '..', 'docs', 'dist');
const INDEX_HTML = path.join(DIST_PATH, 'index.html');
const IS_CI = 'CI' in process.env;
const MAX_WIDTH = IS_CI ? 80 : process.stdout.columns - 8;
const THEMES = ['light', 'dark'];
const AXE_PATH = require.resolve('axe-core');
const AXE_SOURCE = fs.readFileSync(AXE_PATH, 'utf8');
const CONCURRENCY = parseInt(process.env.CONCURRENCY as string, 10) || 8;

let foundViolations = false;

const getComponentUrls = async (port: number): Promise<Set<string>> => {
  const urls = new Set<string>([`http://localhost:${port}/`]);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/`);

  // Build a list of all URLs.
  const links = await page.$$('nav.Navigation a[href]');
  for (const link of links) {
    const href = await link.getProperty('href');
    const url = (await href?.jsonValue()) as string;
    urls.add(url);
  }

  await browser.close();

  return urls;
};

const main = async (): Promise<void> => {
  assert(
    fs.existsSync(DIST_PATH) && fs.existsSync(INDEX_HTML),
    'Missing dist/'
  );

  const app = express();
  app.use(express.static(DIST_PATH));
  app.use((req, res) => res.sendFile(INDEX_HTML));
  const server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  const urls = await getComponentUrls(port);

  // Allow multiple instances of puppeteer to run to speed up testing
  const queue = new PQueue({
    concurrency: CONCURRENCY
  });

  // Analyze each URL.
  await Promise.all(
    Array.from(urls).map((url: string) => {
      return queue.add(async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:${port}/`);

        const component = (url.split('/').pop() as string) || 'Index';

        try {
          await page.goto(url, { waitUntil: 'networkidle0' });
        } catch (ex) {
          console.log(url);
          throw ex;
        }

        for (const theme of THEMES) {
          await page.evaluate(
            (theme) => {
              document.body.className = '';
              document.body.classList.add(`cauldron--theme-${theme}`);
            },
            [theme]
          );

          // Try to wait until there is an idle period up to a max of 5s
          await Promise.race([
            await page.evaluate(
              () =>
                new Promise((resolve) =>
                  // Typescript does not implement experimental apis but this should exist within puppeteer
                  // see: https://github.com/microsoft/TypeScript/issues/21309
                  (window as any).requestIdleCallback(resolve)
                )
            ),
            await new Promise((resolve) => setTimeout(resolve, 5000))
          ]);

          const axe = new AxePuppeteer(page, AXE_SOURCE).withTags([
            'wcag2a',
            'wcag2aa',
            'wcag21a',
            'wcag21aa',
            'wcag22a',
            'wcag22aa'
          ]);
          const { violations } = (await axe.analyze()) as AxeResults;

          let symbol = logSymbols.success;
          if (violations.length) {
            symbol = logSymbols.warning;
            foundViolations = true;
          }

          const title =
            chalk.cyan(chalk.bold(component)) +
            ' (' +
            chalk.italic(theme) +
            ')';
          const dots = '.'.repeat(MAX_WIDTH - component.length - symbol.length);
          console.log(title, dots, symbol);

          for (const { id, help, nodes } of violations) {
            console.log('↳', chalk.underline(chalk.magenta(id)), '━', help);
            nodes.map((node) => {
              console.log(
                '  ↳',
                chalk.bgGreen(chalk.black(`${node.target}`)),
                chalk.yellowBright(node.html)
              );
            });
          }
        }

        await page.close();
        await browser.close();
      });
    })
  );

  server.close();
};

main()
  .then(() => {
    if (foundViolations) {
      console.log();
      throw new Error('Found accessibility violations');
    }
  })
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

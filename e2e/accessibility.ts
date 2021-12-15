import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';
import express from 'express';
import { AxeResults } from 'axe-core';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { AddressInfo } from 'net';

const DIST_PATH = path.join(__dirname, '..', 'docs', 'dist');
const INDEX_HTML = path.join(DIST_PATH, 'index.html');
const IS_CI = 'CI' in process.env;
const MAX_WIDTH = IS_CI ? 80 : process.stdout.columns - 8;
const THEMES = ['light', 'dark'];
const AXE_PATH = require.resolve('axe-core');
const AXE_SOURCE = fs.readFileSync(AXE_PATH, 'utf8');

let foundViolations = false;

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

  const urls = new Set<string>([`http://localhost:${port}/`]);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/`);

  // Build a list of all URLs.
  const links = await page.$$('.SideBar a[href]');
  for (const link of links) {
    const href = await link.getProperty('href');
    const url = (await href?.jsonValue()) as string;
    urls.add(url);
  }

  // Analyze each URL.
  for (const url of urls) {
    const component = (url.split('/').pop() as string) || 'Index';

    await page.goto(url);

    for (const theme of THEMES) {
      await page.evaluate(
        theme => {
          document.body.className = '';
          document.body.classList.add(`cauldron--theme-${theme}`);
        },
        [theme]
      );

      // Try to wait until there is an idle period up to a max of 5s
      await Promise.race([
        await page.evaluate(
          () =>
            new Promise(resolve =>
              // Typescript does not implement experimental apis but this should exist within puppeteer
              // see: https://github.com/microsoft/TypeScript/issues/21309
              (window as any).requestIdleCallback(resolve)
            )
        ),
        await page.waitForTimeout(5000)
      ]);

      const axe = new AxePuppeteer(page, AXE_SOURCE).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa'
      ]);
      const { violations } = (await axe.analyze()) as AxeResults;

      let symbol = logSymbols.success;
      if (violations.length) {
        symbol = logSymbols.warning;
        foundViolations = true;
      }

      const title =
        chalk.cyan(chalk.bold(component)) + ' (' + chalk.italic(theme) + ')';
      const dots = '.'.repeat(MAX_WIDTH - component.length - symbol.length);
      console.log(title, dots, symbol);

      for (const { id, help, nodes } of violations) {
        console.log('↳', chalk.underline(chalk.magenta(id)), '━', help);
        nodes.map(node => {
          console.log(
            '  ↳',
            chalk.bgGreen(chalk.black(`${node.target}`)),
            chalk.yellowBright(node.html)
          );
        });
      }
    }
  }

  server.close();
  await page.close();
  await browser.close();
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

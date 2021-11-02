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

  const results = new Map<string, AxeResults>();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/`);

  const links = await page.$$('.SideBar a[href]');
  for (const link of links) {
    const href = await link.getProperty('href');
    const url = (await href?.jsonValue()) as string;

    if (results.has(url)) {
      console.warn('Already analyze page', { url });
      return;
    }

    const p = await browser.newPage();
    await p.goto(url);

    const axe = new AxePuppeteer(p);
    results.set(url, (await axe.analyze()) as AxeResults);

    await p.close();
  }

  server.close();
  await page.close();
  await browser.close();

  // In CI, don't try to measure; use 2x the longest template name instead.
  const maxWidth = IS_CI
    ? 2 * Math.max(0, ...[...results.keys()].map(t => t.length))
    : process.stdout.columns - 8;

  let foundViolations = false;

  for (const [url, { violations }] of results) {
    let symbol = logSymbols.success;
    if (violations.length) {
      symbol = logSymbols.warning;
      foundViolations = true;
    }

    const file = chalk.cyan(chalk.bold(url));
    const dots = '.'.repeat(maxWidth - url.length - symbol.length);
    console.log(file, dots, symbol);

    for (const { id, help } of violations) {
      console.log('↳', chalk.underline(chalk.magenta(id)), '━', help);
    }
  }

  if (foundViolations) {
    console.log();
    throw new Error('Found accessibility violations');
  }
};

main().catch((error: Error) => {
  console.error(error);
  process.exit(1);
});

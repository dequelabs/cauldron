import puppeteer from 'puppeteer';

/**
 * Resolve a Chromium executable path that survives pnpm's strict-isolation
 * symlink layout. Puppeteer's default browser-discovery walks ancestor
 * node_modules and can miss the bundled browser under node_modules/.pnpm/...,
 * so we ask puppeteer where it thinks the browser is, then fall back to the
 * CHROME_BIN env var (used in CI where system Chrome is preinstalled).
 */
export function determineBrowserPath(): string {
  const configured = puppeteer.executablePath();
  if (configured) return configured;
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  throw new Error(
    "No Chromium binary found — set CHROME_BIN or install puppeteer's browser."
  );
}

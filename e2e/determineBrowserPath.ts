import puppeteer from 'puppeteer';

/**
 * Resolve a Chromium executable path that survives pnpm's strict-isolation
 * symlink layout. Puppeteer's default browser-discovery walks ancestor
 * node_modules and can miss the bundled browser under node_modules/.pnpm/...,
 * so CI sets CHROME_BIN to point at the preinstalled system Chrome and we
 * honor that first. Otherwise we ask puppeteer where its bundled browser is
 * — note that `executablePath()` returns the expected path string even when
 * the binary hasn't been downloaded, so the final throw is defensive only.
 */
export function determineBrowserPath(): string {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const configured = puppeteer.executablePath();
  if (configured) return configured;
  throw new Error(
    "No Chromium binary found — set CHROME_BIN or install puppeteer's browser."
  );
}

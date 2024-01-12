import { defineConfig, devices } from '@playwright/experimental-ct-react17';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  preserveOutput: 'never',
  testDir: './e2e',
  outputDir: './e2e/test-results',
  snapshotDir: './e2e/screenshots',
  snapshotPathTemplate: '{snapshotDir}/{arg}.png',
  timeout: 10 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'line',
  use: {
    ctPort: 3100
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});

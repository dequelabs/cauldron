import { test, expect } from '@playwright/experimental-ct-react';
import { setTheme } from './helpers/playwright';

test.beforeEach(async ({ page }) => {
  await setTheme(page, 'light');
});

export { test, expect };

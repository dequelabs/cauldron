import { test, expect } from '@playwright/experimental-ct-react17';
import { setTheme } from './helpers/playwright';

test.beforeEach(({ page }) => {
  setTheme(page, 'light');
});

export { test, expect };

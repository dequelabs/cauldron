import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import { BottomSheet } from '../../../';

test('should have screenshot for BottomSheet', async ({ mount, page }) => {
  /*
   * because the BottomSheet is absolutely positioned, customizing the viewport
   * and padding styles is needed to ensure we're only capturing the necessary
   * portions of the page for screenshot comparison
   */
  await page.setViewportSize({ height: 600, width: 660 });
  await mount(
    <BottomSheet
      style={{
        padding: '10px 10px 0 10px',
        maxWidth: 'var(--bottom-sheet-width)'
      }}
      data-testid="bottomsheet"
      label="Bottom Sheet Title"
      open
    >
      <p>Content for Bottom Sheet</p>
    </BottomSheet>
  );

  const component = page.getByTestId('bottomsheet');
  await expect(component).toHaveScreenshot('bottomsheet');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--bottomsheet');
});

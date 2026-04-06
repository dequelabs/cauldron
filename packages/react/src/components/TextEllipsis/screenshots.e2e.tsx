import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import { TextEllipsis } from '../../../';

test('should have screenshot for TextEllipsis', async ({ mount, page }) => {
  const component = await mount(
    <div style={{ width: '200px' }}>
      <TextEllipsis>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </TextEllipsis>
    </div>
  );

  await expect(component).toHaveScreenshot('text-ellipsis');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--text-ellipsis');
});

test('should have screenshot for TextEllipsis[maxLines]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div style={{ width: '200px' }}>
      <TextEllipsis maxLines={2}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </TextEllipsis>
    </div>
  );

  await expect(component).toHaveScreenshot('text-ellipsis[maxLines]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--text-ellipsis[maxLines]');
});

test('should have screenshot for TextEllipsis[hideTooltip]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div style={{ width: '200px' }}>
      <TextEllipsis hideTooltip>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </TextEllipsis>
    </div>
  );

  await expect(component).toHaveScreenshot('text-ellipsis[hideTooltip]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--text-ellipsis[hideTooltip]');
});

import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import { TextEllipsis } from '../../../';

const overflowText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

test('should have screenshot for TextEllipsis', async ({ mount, page }) => {
  const component = await mount(
    <div style={{ width: '200px' }}>
      <TextEllipsis>{overflowText}</TextEllipsis>
    </div>
  );

  await expect(component).toHaveScreenshot('text-ellipsis');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--text-ellipsis');
});

test('should have screenshot for TextEllipsis tooltip on hover', async ({
  mount,
  page
}) => {
  await mount(
    <div style={{ width: '200px' }}>
      <TextEllipsis>{overflowText}</TextEllipsis>
    </div>
  );

  const ellipsis = page.getByRole('button');
  await ellipsis.waitFor();
  await ellipsis.hover();
  await expect(page.locator('.Tooltip')).toBeVisible();

  await expect(page).toHaveScreenshot('text-ellipsis-tooltip');
  await setTheme(page, 'dark');
  await expect(page).toHaveScreenshot('dark--text-ellipsis-tooltip');
});

test('should have screenshot for TextEllipsis[maxLines=2]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div style={{ width: '200px' }}>
      <TextEllipsis maxLines={2}>{overflowText}</TextEllipsis>
    </div>
  );

  await expect(component).toHaveScreenshot('text-ellipsis[maxLines=2]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--text-ellipsis[maxLines=2]');
});

test('should have screenshot for TextEllipsis[hideTooltip]', async ({
  mount,
  page
}) => {
  await mount(
    <div style={{ width: '200px' }}>
      <TextEllipsis hideTooltip>{overflowText}</TextEllipsis>
    </div>
  );

  const ellipsis = page.locator('.TextEllipsis');
  await ellipsis.hover();
  await expect(page.locator('.Tooltip')).toHaveCount(0);

  await expect(page).toHaveScreenshot('text-ellipsis[hideTooltip]');
  await setTheme(page, 'dark');
  await expect(page).toHaveScreenshot('dark--text-ellipsis[hideTooltip]');
});

test('should have screenshot for TextEllipsis[hideTooltip][maxLines=2]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div style={{ width: '200px' }}>
      <TextEllipsis hideTooltip maxLines={2}>
        {overflowText}
      </TextEllipsis>
    </div>
  );

  await expect(component).toHaveScreenshot(
    'text-ellipsis[hideTooltip][maxLines=2]'
  );
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--text-ellipsis[hideTooltip][maxLines=2]'
  );
});

test('should have screenshot for TextEllipsis without overflow', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div style={{ width: '200px' }}>
      <TextEllipsis>Short text</TextEllipsis>
    </div>
  );

  await expect(component).toHaveScreenshot('text-ellipsis-no-overflow');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--text-ellipsis-no-overflow');
});

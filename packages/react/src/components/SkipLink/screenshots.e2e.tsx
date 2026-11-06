import React from 'react';
import type { Page } from '@playwright/test';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import { SkipLink } from '../../../';

test('should have screenshot for SkipLink', async ({ mount, page }) => {
  await mount(<SkipLink target="#main-content" />);

  const navigation = page.getByRole('navigation');
  await navigation.getByRole('link').focus();
  await expect(navigation).toHaveClass(/SkipLink--fade/);

  await expect(navigation).toHaveScreenshot('skiplink');
  await setTheme(page, 'dark');
  await expect(navigation).toHaveScreenshot('dark--skiplink');
});

test('should have screenshot for SkipLink with custom target text', async ({
  mount,
  page
}) => {
  await mount(
    <SkipLink
      target="#main-content"
      skipText="Skip to"
      targetText="Main page content"
    />
  );

  const navigation = page.getByRole('navigation');
  await navigation.getByRole('link').focus();
  await expect(navigation).toHaveClass(/SkipLink--fade/);

  await expect(navigation).toHaveScreenshot('skiplink-custom-text');
  await setTheme(page, 'dark');
  await expect(navigation).toHaveScreenshot('dark--skiplink-custom-text');
});

test.describe('on a 320px mobile viewport with enlarged text', () => {
  // A mobile browser widens the page to fit content, also off-screen content.
  test.use({ viewport: { width: 320, height: 640 }, isMobile: true });

  const getPageWidth = (page: Page) =>
    page.evaluate(() =>
      Math.max(window.innerWidth, document.documentElement.scrollWidth)
    );

  test.beforeEach(async ({ page }) => {
    await page.addStyleTag({ content: 'html { font-size: 24px; }' });
  });

  test('should fit the viewport when focused', async ({ mount, page }) => {
    await mount(<SkipLink target="#main-content" />);

    const navigation = page.getByRole('navigation');
    await navigation.getByRole('link').focus();
    await expect(navigation).toHaveClass(/SkipLink--fade/);

    expect(await getPageWidth(page)).toBeLessThanOrEqual(320);
    const box = await navigation.boundingBox();
    expect((box?.x ?? Infinity) + (box?.width ?? 0)).toBeLessThanOrEqual(320);
  });
});

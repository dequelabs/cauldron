import React from 'react';
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

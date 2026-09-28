import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import { Notice } from '../../../';

test('should have screenshot for Notice[type="info"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Notice type="info" title="Information">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at
      porttitor sem. Aliquam erat volutpat. Donec placerat nisl magna, et
      faucibus arcu condimentum sed.
    </Notice>
  );

  await expect(component).toHaveScreenshot('notice-info');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--notice-info');
});

test('should have screenshot for Notice[type="caution"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Notice type="caution" title="Caution">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at
      porttitor sem. Aliquam erat volutpat. Donec placerat nisl magna, et
      faucibus arcu condimentum sed.
    </Notice>
  );

  await expect(component).toHaveScreenshot('notice-caution');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--notice-caution');
});

test('should have screenshot for Notice[type="danger"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Notice type="danger" title="Danger!">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at
      porttitor sem. Aliquam erat volutpat. Donec placerat nisl magna, et
      faucibus arcu condimentum sed.
    </Notice>
  );

  await expect(component).toHaveScreenshot('notice-danger');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--notice-danger');
});

test('should have screenshot for Notice[type="success"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Notice type="success" title="Success">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at
      porttitor sem. Aliquam erat volutpat. Donec placerat nisl magna, et
      faucibus arcu condimentum sed.
    </Notice>
  );

  await expect(component).toHaveScreenshot('notice-success');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--notice-success');
});

test('should have screenshot for thin Notice (title only)', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Notice
      type="caution"
      title="Caution, about to tread into dangerous territory"
    />
  );

  await expect(component).toHaveScreenshot('notice-thin');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--notice-thin');
});

test('should have screenshot for Notice with custom icon', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Notice type="caution" title="Dynamo!" icon="bolt">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at
      porttitor sem. Aliquam erat volutpat. Donec placerat nisl magna, et
      faucibus arcu condimentum sed.
    </Notice>
  );

  await expect(component).toHaveScreenshot('notice-custom-icon');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--notice-custom-icon');
});

test('should have screenshot for Notice[variant="default"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Notice variant="default" type="info" title="Information">
      Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
      libero et velit interdum, ac aliquet odio mattis.
      <ul>
        <li>List item</li>
        <li>List item</li>
        <li>List item</li>
      </ul>
    </Notice>
  );

  await expect(component).toHaveScreenshot('notice-variant-default');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--notice-variant-default');
});

test('should have screenshot for Notice[variant="condensed"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Notice variant="condensed" type="info" title="Information">
      Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
      libero et velit interdum, ac aliquet odio mattis.
      <ul>
        <li>List item</li>
        <li>List item</li>
        <li>List item</li>
      </ul>
    </Notice>
  );

  await expect(component).toHaveScreenshot('notice-variant-condensed');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--notice-variant-condensed');
});

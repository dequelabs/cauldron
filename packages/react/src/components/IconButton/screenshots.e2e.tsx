import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { IconButton } from '../../../';

test('should have screenshot for IconButton[variant="secondary"]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the icon button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <IconButton icon="pencil" label="IconButton" />
      <IconButton icon="pencil" label="Hover" />
      <IconButton icon="pencil" label="Focus" />
      <IconButton icon="pencil" label="Active" />
      <IconButton icon="pencil" label="Disabled" disabled />
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByLabel('Active'));
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot('iconbutton[variant=secondary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--iconbutton[variant=secondary]'
  );
});

test('should have screenshot for IconButton[variant="primary"]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the icon button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <IconButton icon="pencil" label="IconButton" variant="primary" />
      <IconButton icon="pencil" label="Hover" variant="primary" />
      <IconButton icon="pencil" label="Focus" variant="primary" />
      <IconButton icon="pencil" label="Active" variant="primary" />
      <IconButton icon="pencil" label="Disabled" variant="primary" disabled />
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByLabel('Active'));
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot('iconbutton[variant=primary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--iconbutton[variant=primary]');
});

test('should have screenshot for IconButton[variant="error"]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the icon button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <IconButton icon="pencil" label="IconButton" variant="error" />
      <IconButton icon="pencil" label="Hover" variant="error" />
      <IconButton icon="pencil" label="Focus" variant="error" />
      <IconButton icon="pencil" label="Active" variant="error" />
      <IconButton icon="pencil" label="Disabled" variant="error" disabled />
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByLabel('Active'));
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot('iconbutton[variant=error]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--iconbutton[variant=error]');
});

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

test('should have screenshot for IconButton[variant="tertiary"]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the icon button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <IconButton icon="pencil" label="IconButton" variant="tertiary" />
      <IconButton icon="pencil" label="Hover" variant="tertiary" />
      <IconButton icon="pencil" label="Focus" variant="tertiary" />
      <IconButton icon="pencil" label="Active" variant="tertiary" />
      <IconButton icon="pencil" label="Disabled" disabled variant="tertiary" />
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByLabel('Active'));
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot('iconbutton[variant=tertiary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--iconbutton[variant=tertiary]'
  );
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

test('should have screenshot for IconButton[variant="danger"]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the icon button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <IconButton icon="pencil" label="IconButton" variant="danger" />
      <IconButton icon="pencil" label="Hover" variant="danger" />
      <IconButton icon="pencil" label="Focus" variant="danger" />
      <IconButton icon="pencil" label="Active" variant="danger" />
      <IconButton icon="pencil" label="Disabled" variant="danger" disabled />
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByLabel('Active'));
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot('iconbutton[variant=danger]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--iconbutton[variant=danger]');
});

test('should have screenshot for IconButton[variant="secondary"][large]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the icon button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <IconButton icon="pencil" label="IconButton" large />
      <IconButton icon="pencil" label="Hover" large />
      <IconButton icon="pencil" label="Focus" large />
      <IconButton icon="pencil" label="Active" large />
      <IconButton icon="pencil" label="Disabled" disabled large />
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByLabel('Active'));
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot(
    'iconbutton[variant=secondary][large]'
  );
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--iconbutton[variant=secondary][large]'
  );
});

test('should have screenshot for IconButton[variant="primary"][large]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the icon button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <IconButton icon="pencil" label="IconButton" variant="primary" large />
      <IconButton icon="pencil" label="Hover" variant="primary" large />
      <IconButton icon="pencil" label="Focus" variant="primary" large />
      <IconButton icon="pencil" label="Active" variant="primary" large />
      <IconButton
        icon="pencil"
        label="Disabled"
        variant="primary"
        disabled
        large
      />
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByLabel('Active'));
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot(
    'iconbutton[variant=primary][large]'
  );
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--iconbutton[variant=primary][large]'
  );
});

test('should have screenshot for IconButton[variant="tertiary"][large]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the icon button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <IconButton icon="pencil" label="IconButton" variant="tertiary" large />
      <IconButton icon="pencil" label="Hover" variant="tertiary" large />
      <IconButton icon="pencil" label="Focus" variant="tertiary" large />
      <IconButton icon="pencil" label="Active" variant="tertiary" large />
      <IconButton
        icon="pencil"
        label="Disabled"
        disabled
        variant="tertiary"
        large
      />
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByLabel('Active'));
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot(
    'iconbutton[variant=tertiary][large]'
  );
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--iconbutton[variant=tertiary][large]'
  );
});

test('should have screenshot for IconButton[variant="error"][large]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the icon button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <IconButton icon="pencil" label="IconButton" variant="error" large />
      <IconButton icon="pencil" label="Hover" variant="error" large />
      <IconButton icon="pencil" label="Focus" variant="error" large />
      <IconButton icon="pencil" label="Active" variant="error" large />
      <IconButton
        icon="pencil"
        label="Disabled"
        variant="error"
        disabled
        large
      />
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByLabel('Active'));
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot('iconbutton[variant=error][large]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--iconbutton[variant=error][large]'
  );
});

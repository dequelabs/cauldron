import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { Switch, FieldWrap } from '../../../';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

test('should have screenshot for Switch', async ({ mount, page }) => {
  const component = await mount(
    <FieldWrap>
      <Switch id="switch" label="Switch" />
      <Switch id="switch-hover" label="Hover" />
      <Switch id="switch-focus" label="Focus" />
      <Switch id="switch-active" label="Active" />
      <Switch id="switch-disabled" label="Disabled" disabled />
    </FieldWrap>
  );

  await component.getByRole('switch', { name: 'Focus' }).focus();
  await component.getByText('Hover').hover();
  setActive(
    await component.locator('.Switch__wrap:nth-child(4) .Switch__track')
  );

  await expect(component).toHaveScreenshot('switch');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--switch');
});

test('should have screenshot for Switch[checked]', async ({ mount, page }) => {
  const component = await mount(
    <FieldWrap>
      <Switch id="switch" label="Switch" checked onChange={noop} />
      <Switch id="switch-hover" label="Hover" checked onChange={noop} />
      <Switch id="switch-focus" label="Focus" checked onChange={noop} />
      <Switch id="switch-active" label="Active" checked onChange={noop} />
      <Switch
        id="switch-disabled"
        label="Disabled"
        checked
        disabled
        onChange={noop}
      />
    </FieldWrap>
  );

  await component.getByRole('switch', { name: 'Focus' }).focus();
  await component.getByText('Hover').hover();
  setActive(
    await component.locator('.Switch__wrap:nth-child(4) .Switch__track')
  );

  await expect(component).toHaveScreenshot('switch[checked]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--switch[checked]');
});

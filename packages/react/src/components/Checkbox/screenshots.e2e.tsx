import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { Checkbox, FieldWrap } from '../../../';

test('should have screenshot for Checkbox', async ({ mount, page }) => {
  const component = await mount(
    <FieldWrap>
      <Checkbox id="checkbox" label="Checkbox" />
      <Checkbox id="checkbox-hover" label="Hover" />
      <Checkbox id="checkbox-focus" label="Focus" />
      <Checkbox id="checkbox-active" label="Active" />
      <Checkbox id="checkbox-disabled" label="Disabled" disabled />
    </FieldWrap>
  );

  await component.getByRole('checkbox', { name: 'Focus' }).focus();
  await component.getByText('Hover').hover();
  setActive(
    await component.locator('.Checkbox__wrap:nth-child(4) .Checkbox__overlay')
  );

  await expect(component).toHaveScreenshot('checkbox');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--checkbox');
});

test('should have screenshot for Checkbox[checked]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <FieldWrap>
      <Checkbox id="checkbox" label="Checkbox" checked />
      <Checkbox id="checkbox-hover" label="Hover" checked />
      <Checkbox id="checkbox-focus" label="Focus" checked />
      <Checkbox id="checkbox-active" label="Active" checked />
      <Checkbox id="checkbox-disabled" label="Disabled" checked disabled />
    </FieldWrap>
  );

  await component.getByRole('checkbox', { name: 'Focus' }).focus();
  await component.getByText('Hover').hover();
  setActive(
    await component.locator('.Checkbox__wrap:nth-child(4) .Checkbox__overlay')
  );

  await expect(component).toHaveScreenshot('checkbox[checked]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--checkbox[checked]');
});

test('should have screenshot for Checkbox[indeterminate]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <FieldWrap>
      <Checkbox id="checkbox" label="Checkbox" indeterminate />
      <Checkbox id="checkbox-hover" label="Hover" indeterminate />
      <Checkbox id="checkbox-focus" label="Focus" indeterminate />
      <Checkbox id="checkbox-active" label="Active" indeterminate />
      <Checkbox
        id="checkbox-disabled"
        label="Disabled"
        indeterminate
        disabled
      />
    </FieldWrap>
  );

  await component.getByRole('checkbox', { name: 'Focus' }).focus();
  await component.getByText('Hover').hover();
  setActive(
    await component.locator('.Checkbox__wrap:nth-child(4) .Checkbox__overlay')
  );

  await expect(component).toHaveScreenshot('checkbox[indeterminate]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--checkbox[indeterminate]');
});

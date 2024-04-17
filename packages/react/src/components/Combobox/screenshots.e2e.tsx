import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { Combobox, ComboboxOption, FieldWrap } from '../../../';

test('should have screenshot for Combobox', async ({ mount, page }) => {
  await page.addStyleTag({
    // ensure screenshots are able to capture the boundaries of an expanded combobox
    content: `.Combobox__listbox--open.Combobox__listbox { position: relative !important; }`
  });
  const component = await mount(
    <FieldWrap>
      <Combobox label="Combobox">
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
      <Combobox label="Hover">
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
      <Combobox label="Focus">
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
    </FieldWrap>
  );

  await component.getByRole('combobox', { name: 'Focus' }).focus();
  await component.getByRole('combobox', { name: 'Hover' }).hover();

  await expect(component).toHaveScreenshot('combobox');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--combobox');
});

test('should have screenshot for Combobox[error]', async ({ mount, page }) => {
  await page.addStyleTag({
    // ensure screenshots are able to capture the boundaries of an expanded combobox
    content: `.Combobox__listbox--open.Combobox__listbox { position: relative !important; }`
  });
  const component = await mount(
    <FieldWrap>
      <Combobox label="Combobox" error="This field has an error.">
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
      <Combobox label="Hover" error="This field has an error.">
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
      <Combobox label="Focus" error="This field has an error.">
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
    </FieldWrap>
  );

  await component.getByRole('combobox', { name: 'Focus' }).focus();
  await component.getByRole('combobox', { name: 'Hover' }).hover();

  await expect(component).toHaveScreenshot('combobox[error]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--combobox[error]');
});

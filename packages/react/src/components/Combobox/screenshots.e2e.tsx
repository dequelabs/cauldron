import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import { Combobox, ComboboxOption } from '../../../';

test('should have screenshot for Combobox', async ({ mount, page }) => {
  await page.addStyleTag({
    // ensure screenshots are able to capture the boundaries of an expanded combobox
    content: `
      .Combobox__listbox--open.Combobox__listbox { position: relative !important; }
      body.cauldron--theme-dark { background-color: var(--accent-medium); }
    `
  });
  const component = await mount(
    <div>
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
      <Combobox label="Focus" value="Apple">
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
    </div>
  );

  await component.getByRole('combobox', { name: 'Focus' }).focus();
  await component.getByRole('combobox', { name: 'Hover' }).hover();

  await expect(component).toHaveScreenshot('combobox');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--combobox');
});

test('should have screenshot for Combobox[multiselect]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // ensure screenshots are able to capture the boundaries of an expanded combobox
    content: `
      .Combobox__listbox--open.Combobox__listbox { position: relative !important; }
      body.cauldron--theme-dark { background-color: var(--accent-medium); }
    `
  });
  const component = await mount(
    <div>
      <Combobox label="Combobox" multiselect>
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
      <Combobox label="Hover" multiselect>
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
      <Combobox
        label="Disabled"
        disabled
        multiselect
        value={['Apple', 'Banana']}
      >
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
      <Combobox label="Focus" multiselect value={['Apple', 'Banana']}>
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
    </div>
  );

  await component.getByRole('combobox', { name: 'Focus' }).focus();
  await component.getByRole('combobox', { name: 'Hover' }).hover();

  await expect(component).toHaveScreenshot('combobox[multiselect]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--combobox[multiselect]');
});

test('should have screenshot for Combobox[error]', async ({ mount, page }) => {
  await page.addStyleTag({
    // ensure screenshots are able to capture the boundaries of an expanded combobox
    content: `
      .Combobox__listbox--open.Combobox__listbox { position: relative !important; }
      body.cauldron--theme-dark { background-color: var(--accent-medium); }
    `
  });
  const component = await mount(
    <div>
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
      <Combobox label="Focus" error="This field has an error." value="Apple">
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cucumber</ComboboxOption>
      </Combobox>
    </div>
  );

  await component.getByRole('combobox', { name: 'Focus' }).focus();
  await component.getByRole('combobox', { name: 'Hover' }).hover();

  await expect(component).toHaveScreenshot('combobox[error]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--combobox[error]');
});

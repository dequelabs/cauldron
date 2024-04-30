import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { TextField, FieldWrap } from '../../../';

test('should have screenshot for TextField', async ({ mount, page }) => {
  const component = await mount(
    <FieldWrap>
      <TextField label="TextField" value="text field value" />
      <TextField label="Hover" value="text field value" />
      <TextField label="Focus" value="text field value" />
      <TextField label="Disabled" value="text field value" disabled />
    </FieldWrap>
  );

  await component.getByLabel('Hover').hover();
  await component.getByLabel('Focus').focus();

  await expect(component).toHaveScreenshot('textfield');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--textfield');
});

test('should have screenshot for TextField[error]', async ({ mount, page }) => {
  const component = await mount(
    <FieldWrap>
      <TextField
        label="TextField"
        value="text field value"
        error="This field has an error."
      />
      <TextField
        label="Hover"
        value="text field value"
        error="This field has an error."
      />
      <TextField
        label="Focus"
        value="text field value"
        error="This field has an error."
      />
      <TextField
        label="Disabled"
        value="text field value"
        error="This field has an error."
        disabled
      />
    </FieldWrap>
  );

  await component.getByLabel('Hover').hover();
  await component.getByLabel('Focus').focus();

  await expect(component).toHaveScreenshot('textfield[error]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--textfield[error]');
});

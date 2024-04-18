import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { RadioGroup, FieldWrap } from '../../../';

test('should have screenshot for RadioGroup', async ({ mount, page }) => {
  const component = await mount(
    <FieldWrap>
      <RadioGroup
        aria-label="radios"
        name="radios"
        radios={[
          { id: 'radio', label: 'Radio' },
          { id: 'radio-hover', label: 'Hover' },
          { id: 'radio-focus', label: 'Focus' },
          { id: 'radio-active', label: 'Active' },
          { id: 'radio-disabled', label: 'Disabled', disabled: true }
        ]}
      />
    </FieldWrap>
  );

  await component.getByRole('radio', { name: 'Focus' }).focus();
  await component.getByText('Hover').hover();
  setActive(
    await component.locator('.Radio__wrap:nth-child(4) .Radio__overlay')
  );

  await expect(component).toHaveScreenshot('radiogroup');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--radiogroup');
});

test('should have screenshot for RadioGroup[checked]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <FieldWrap>
      <RadioGroup
        aria-label="radios"
        name="radios"
        radios={[
          { id: 'radio', label: 'Radio', value: 'checked' },
          { id: 'radio-hover', label: 'Hover', value: 'checked' },
          { id: 'radio-focus', label: 'Focus', value: 'checked' },
          { id: 'radio-active', label: 'Active', value: 'checked' },
          {
            id: 'radio-disabled',
            label: 'Disabled',
            value: 'checked',
            disabled: true
          }
        ]}
        value="checked"
      />
    </FieldWrap>
  );

  await component.getByRole('radio', { name: 'Focus' }).focus();
  await component.getByText('Hover').hover();
  setActive(
    await component.locator('.Radio__wrap:nth-child(4) .Radio__overlay')
  );

  await expect(component).toHaveScreenshot('radiogroup[checked]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--radiogroup[checked]');
});

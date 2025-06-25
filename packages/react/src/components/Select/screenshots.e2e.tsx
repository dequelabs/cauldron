import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { Select, FieldWrap } from '../../../';

test('should have screenshot for Select', async ({ mount, page }) => {
  const options = [
    { key: 'apple', value: 'Apple' },
    { key: 'banana', value: 'Banana' },
    { key: 'cucumber', value: 'Cucumber' }
  ];
  const component = await mount(
    <FieldWrap>
      <Select options={options} label="Select" />
      <Select options={options} label="Hover" />
      <Select options={options} label="Focus" />
    </FieldWrap>
  );

  await component.getByLabel('Hover').hover();
  await component.getByLabel('Focus').focus();

  await expect(component).toHaveScreenshot('select');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--select');
});

test('should have screenshot for Select[error]', async ({ mount, page }) => {
  const options = [
    { key: 'apple', value: 'Apple' },
    { key: 'banana', value: 'Banana' },
    { key: 'cucumber', value: 'Cucumber' }
  ];
  const component = await mount(
    <FieldWrap>
      <Select
        options={options}
        label="Select"
        error="This field has an error."
      />
      <Select
        options={options}
        label="Hover"
        error="This field has an error."
      />
      <Select
        options={options}
        label="Focus"
        error="This field has an error."
      />
    </FieldWrap>
  );

  await component.getByLabel('Hover').hover();
  await component.getByLabel('Focus').focus();

  await expect(component).toHaveScreenshot('select[error]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--select[error]');
});

test('should have screenshot for Select[with-description]', async ({
  mount,
  page
}) => {
  const options = [
    { key: 'apple', value: 'Apple' },
    { key: 'banana', value: 'Banana' },
    { key: 'cucumber', value: 'Cucumber' }
  ];
  const component = await mount(
    <FieldWrap>
      <Select
        options={options}
        label="Select"
        description="This field has a description."
      />
      <Select
        options={options}
        label="Hover"
        description="This field has a description."
      />
      <Select
        options={options}
        label="Focus"
        description="This field has a description."
      />
    </FieldWrap>
  );

  await component.getByLabel('Hover').hover();
  await component.getByLabel('Focus').focus();

  await expect(component).toHaveScreenshot('select[with-description]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--select[with-description]');
});

test('should have screenshot for Select[error-with-description]', async ({
  mount,
  page
}) => {
  const options = [
    { key: 'apple', value: 'Apple' },
    { key: 'banana', value: 'Banana' },
    { key: 'cucumber', value: 'Cucumber' }
  ];
  const component = await mount(
    <FieldWrap>
      <Select
        options={options}
        label="Select"
        error="This field has an error."
        description="This field has a description."
      />
      <Select
        options={options}
        label="Hover"
        error="This field has an error."
        description="This field has a description."
      />
      <Select
        options={options}
        label="Focus"
        error="This field has an error."
        description="This field has a description."
      />
    </FieldWrap>
  );

  await component.getByLabel('Hover').hover();
  await component.getByLabel('Focus').focus();

  await expect(component).toHaveScreenshot('select[error-with-description]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--select[error-with-description]'
  );
});

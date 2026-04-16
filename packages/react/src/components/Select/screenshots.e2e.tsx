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

test('should have screenshot for Select[required]', async ({ mount, page }) => {
  const component = await mount(
    <FieldWrap>
      <Select label="Select" required defaultValue="">
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cucumber">Cucumber</option>
      </Select>
      <Select label="Hover" required defaultValue="">
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cucumber">Cucumber</option>
      </Select>
      <Select label="Focus" required defaultValue="">
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cucumber">Cucumber</option>
      </Select>
    </FieldWrap>
  );

  await component.getByLabel('Hover').hover();
  // Use evaluate to focus without triggering :user-invalid
  await component
    .getByLabel('Focus')
    .evaluate((el) => (el as HTMLElement).focus());

  await expect(component).toHaveScreenshot('select[required]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--select[required]');
});

test('should have screenshot for Select[required] after interaction', async ({
  mount,
  page
}) => {
  const component = await mount(
    <FieldWrap>
      <Select label="Select" required defaultValue="">
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cucumber">Cucumber</option>
      </Select>
      <Select label="Hover" required defaultValue="">
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cucumber">Cucumber</option>
      </Select>
      <Select label="Focus" required defaultValue="">
        <option value="">Select a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cucumber">Cucumber</option>
      </Select>
    </FieldWrap>
  );

  // Change value then revert to invalid to trigger :user-invalid
  for (const label of ['Select', 'Hover', 'Focus']) {
    await component.getByLabel(label).selectOption('apple');
    await component.getByLabel(label).selectOption('');
    await component.getByLabel(label).blur();
  }

  await component.getByLabel('Hover').hover();
  await component.getByLabel('Focus').focus();

  await expect(component).toHaveScreenshot(
    'select[required]-after-interaction'
  );
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--select[required]-after-interaction'
  );
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

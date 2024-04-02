import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react17';
import { setTheme, setActive } from './helpers/playwright';
import {
  Button,
  IconButton,
  FieldWrap,
  TextField,
  SearchField,
  Select,
  Checkbox,
  Combobox,
  ComboboxOption,
  RadioGroup
} from '../packages/react/lib';

test.beforeEach(({ page }) => {
  setTheme(page, 'light');
});

test('should have screenshot for Button[variant="primary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="primary">Primary</Button>
      <Button variant="primary">Hover</Button>
      <Button variant="primary">Active</Button>
      <Button variant="primary">Focus</Button>
      <Button variant="primary" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component
    .getByText('Active')
    .press('Space', { delay: 1000, noWaitAfter: true });
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=primary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=primary]');
});

test('should have screenshot for Button[thin][variant="primary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="primary" thin>
        Primary
      </Button>
      <Button variant="primary" thin>
        Hover
      </Button>
      <Button variant="primary" thin>
        Active
      </Button>
      <Button variant="primary" thin>
        Focus
      </Button>
      <Button variant="primary" thin disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[thin][variant=primary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--button[thin][variant=primary]'
  );
});

test('should have screenshot for Button[variant="secondary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="secondary">Secondary</Button>
      <Button variant="secondary">Hover</Button>
      <Button variant="secondary">Active</Button>
      <Button variant="secondary">Focus</Button>
      <Button variant="secondary" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=secondary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=secondary]');
});

test('should have screenshot for Button[thin][variant="secondary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="secondary" thin>
        Primary
      </Button>
      <Button variant="secondary" thin>
        Hover
      </Button>
      <Button variant="secondary" thin>
        Active
      </Button>
      <Button variant="secondary" thin>
        Focus
      </Button>
      <Button variant="secondary" thin disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[thin][secondary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[thin][secondary]');
});

test('should have screenshot for Button[variant="error"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="error">Error</Button>
      <Button variant="error">Hover</Button>
      <Button variant="error">Active</Button>
      <Button variant="error">Focus</Button>
      <Button variant="error" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=error]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=error]');
});

test('should have screenshot for Button[thin][variant="error"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="error" thin>
        Error
      </Button>
      <Button variant="error" thin>
        Hover
      </Button>
      <Button variant="error" thin>
        Active
      </Button>
      <Button variant="error" thin>
        Focus
      </Button>
      <Button variant="error" thin disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[thin][variant=error]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[thin][variant=error]');
});

test('should have screenshot for Button[variant="link"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="link">Link</Button>
      <Button variant="link">Hover</Button>
      <Button variant="link">Active</Button>
      <Button variant="link">Focus</Button>
      <Button variant="link" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=link]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=link]');
});

test('should have screenshot for Button[variant="tag"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="tag">Tag</Button>
      <Button variant="tag">Hover</Button>
      <Button variant="tag">Active</Button>
      <Button variant="tag">Focus</Button>
      <Button variant="tag" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=tag]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=tag]');
});

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

test('should have screenshot for SearchField', async ({ mount, page }) => {
  const component = await mount(
    <FieldWrap>
      <SearchField label="SearchField" value="search field value" />
      <SearchField label="Hover" value="search field value" />
      <SearchField label="Focus" value="search field value" />
      <SearchField label="Disabled" value="search field value" disabled />
    </FieldWrap>
  );

  await component.getByRole('search', { name: 'Hover' }).hover();
  await component.getByRole('search', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot('searchfield');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--searchfield');
});

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

// test.only('should have screenshot for IconButton[variant="primary"]', async ({
//   mount,
//   page
// }) => {
//   const component = await mount(
//     <div>
//       <IconButton icon="pencil" variant="primary" label="Primary" />
//       <IconButton icon="pencil" label="Hover" />
//       <IconButton icon="pencil" label="Active" />
//       <IconButton icon="pencil" label="Focus" />
//       <IconButton icon="pencil" variant="primary" disabled label="Disabled" />
//     </div>
//   );
// console.log(await component.innerHTML())
// console.log(await page.evaluate(() => document.body.innerHTML))
//   await component.locator('.IconButton').hover();
//   // setActive(await component.locator('.IconButton'));
//   // await component
//   //   .locator('.IconButton')
//   //   .press('Space', { delay: 1000, noWaitAfter: true });
//   // await component.locator('.IconButton').focus();

//   await expect(component).toHaveScreenshot('iconbutton[variant=primary]');
//   await setTheme(page, 'dark');
//   await expect(component).toHaveScreenshot('dark--iconbutton[variant=primary]');
// });

import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react17';
import { setTheme, setActive } from './helpers/playwright';
import Button from '../packages/react/src/components/Button';
// import IconButton from '../packages/react/src/components/IconButton';
import FieldWrap from '../packages/react/src/components/FieldWrap';
import TextField from '../packages/react/src/components/TextField';
import Select from '../packages/react/src/components/Select';
// import Checkbox from '../packages/react/src/components/Checkbox';
// import { default as Combobox, ComboboxOption } from '../packages/react/src/components/Combobox';

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

// test('should have screenshot for Combobox', async ({
//   mount,
//   page
// }) => {
//   const options = [

//   ]
//   await page.addStyleTag({
//     content: `.Combobox__listbox { position: relative: !important; }`
//   })
//   const component = await mount(
//     <FieldWrap>
//       <Combobox label="Combobox">
//         <ComboboxOption>Apple</ComboboxOption>
//         <ComboboxOption>Banana</ComboboxOption>
//         <ComboboxOption>Cucumber</ComboboxOption>
//       </Combobox>
//     </FieldWrap>
//   );

//   console.log(await page.evaluate(() => document.documentElement.outerHTML))

//   await component.getByRole('combobox').focus();

//   await expect(component).toHaveScreenshot('combobox');
//   await setTheme(page, 'dark');
//   await expect(component).toHaveScreenshot('dark--combobox]');
// })

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

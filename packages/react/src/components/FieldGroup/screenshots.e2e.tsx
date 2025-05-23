import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import { Checkbox, RadioGroup, FieldWrap, FieldGroup } from '../../../';

test('should have screenshot for FieldGroup with checkboxes', async ({
  mount,
  page
}) => {
  const component = await mount(
    <FieldWrap>
      <FieldGroup label="Group Label" description="Group Description">
        <Checkbox id="checkbox-a" label="Checkbox A" />
        <Checkbox id="checkbox-b" label="Checkbox B" />
        <Checkbox id="checkbox-v" label="Checkbox C" />
      </FieldGroup>
    </FieldWrap>
  );

  await expect(component).toHaveScreenshot('fieldgroup-checkbox');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--fieldgroup-checkbox');
});

test('should have screenshot for FieldGroup with radios', async ({
  mount,
  page
}) => {
  const component = await mount(
    <FieldWrap>
      <FieldGroup label="Group Label" description="Group Description">
        <RadioGroup
          radios={[
            {
              id: 'radio-a',
              label: 'Radio A',
              value: 'A'
            },
            {
              id: 'radio-b',
              label: 'Radio A',
              value: 'B'
            },
            {
              id: 'radio-c',
              label: 'Radio A',
              value: 'C'
            }
          ]}
        />
      </FieldGroup>
    </FieldWrap>
  );

  await expect(component).toHaveScreenshot('fieldgroup-radio');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--fieldgroup-radio');
});

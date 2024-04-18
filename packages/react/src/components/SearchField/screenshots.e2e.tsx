import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { SearchField, FieldWrap } from '../../../';

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

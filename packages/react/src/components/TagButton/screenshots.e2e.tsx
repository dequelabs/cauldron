import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { TagButton } from '../../../';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

test('should have screenshot for TagButton[size="small"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <TagButton
        label="Label:"
        value="Value"
        icon="pencil"
        size="small"
        onClick={noop}
      />
      <TagButton
        label="Label:"
        value="Hover"
        icon="pencil"
        size="small"
        onClick={noop}
      />
      <TagButton
        label="Label:"
        value="Active"
        icon="pencil"
        size="small"
        onClick={noop}
      />
      <TagButton
        label="Label:"
        value="Focus"
        icon="pencil"
        size="small"
        onClick={noop}
      />
      <TagButton
        label="Label:"
        value="Disabled"
        icon="pencil"
        size="small"
        disabled
        onClick={noop}
      />
    </div>
  );

  await component.getByRole('button', { name: /Hover/ }).hover();
  setActive(component.getByRole('button', { name: /Active/ }));
  await component.getByRole('button', { name: /Focus/ }).focus();

  await expect(component).toHaveScreenshot('tag-button[size=small]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--tag-button[size=small]');
});

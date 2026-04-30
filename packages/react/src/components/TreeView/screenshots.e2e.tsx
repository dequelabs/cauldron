import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import { TreeView } from '../../../';

const items = [
  {
    id: '1',
    textValue: 'Fruits',
    children: [
      { id: '2', textValue: 'Apple' },
      { id: '3', textValue: 'Banana' }
    ]
  },
  {
    id: '4',
    textValue: 'Vegetables',
    children: [
      { id: '5', textValue: 'Carrot' },
      { id: '6', textValue: 'Broccoli' }
    ]
  }
];

test('should have screenshot for TreeView default', async ({ mount, page }) => {
  const component = await mount(
    <TreeView aria-label="Food categories" items={items} />
  );
  await expect(component).toHaveScreenshot('tree-view-default');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--tree-view-default');
});

test('should have screenshot for TreeView expanded', async ({
  mount,
  page
}) => {
  const component = await mount(
    <TreeView
      aria-label="Food categories"
      items={items}
      defaultExpandedKeys={['1', '4']}
    />
  );
  await expect(component).toHaveScreenshot('tree-view-expanded');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--tree-view-expanded');
});

test('should have screenshot for TreeView single selection', async ({
  mount,
  page
}) => {
  const component = await mount(
    <TreeView
      aria-label="Food categories"
      items={items}
      selectionMode="single"
      defaultExpandedKeys={['1']}
    />
  );
  await component.getByRole('row', { name: 'Apple' }).click();
  await expect(component).toHaveScreenshot('tree-view-single-selection');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--tree-view-single-selection');
});

test('should have screenshot for TreeView multiple selection', async ({
  mount,
  page
}) => {
  const component = await mount(
    <TreeView
      aria-label="Food categories"
      items={items}
      selectionMode="multiple"
      defaultExpandedKeys={['1']}
    />
  );
  await component.getByRole('checkbox', { name: 'Fruits' }).click();
  await component.getByRole('checkbox', { name: 'Apple' }).click();
  await expect(component).toHaveScreenshot('tree-view-multiple-selection');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--tree-view-multiple-selection'
  );
});

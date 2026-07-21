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

test('should have screenshot for TreeView virtualized', async ({
  mount,
  page
}) => {
  const longItems = Array.from({ length: 200 }, (_, i) => ({
    id: String(i + 1),
    textValue: `Item ${i + 1}`
  }));
  const component = await mount(
    // The screenshot harness sizes the mounted root to its content
    // (`min-height`/`max-width: max-content` on `#root > div`), which would
    // override the fixed height and collapse the width of virtualized (absolutely
    // positioned) rows. Wrapping in a div and giving the tree an explicit width
    // lets the fixed-height scroll region render as it does in a real app.
    <div>
      <TreeView
        aria-label="Long list"
        items={longItems}
        selectionMode="multiple"
        height={240}
        style={{ width: 420 }}
      />
    </div>
  );
  // Windowing check: a screenshot alone can't catch a virtualization regression
  // because 8 rows and 200 rows look identical in the visible region. Assert the
  // DOM holds only a small subset of the 200 mounted rows.
  const renderedRows = await component.getByRole('row').count();
  expect(renderedRows).toBeGreaterThan(0);
  expect(renderedRows).toBeLessThan(50);
  await expect(component).toHaveScreenshot('tree-view-virtualized');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--tree-view-virtualized');
});

test('virtualized TreeView keeps keyboard focus when the focused row scrolls out of view', async ({
  mount,
  page
}) => {
  const longItems = Array.from({ length: 200 }, (_, i) => ({
    id: String(i + 1),
    textValue: `Item ${i + 1}`
  }));
  const component = await mount(
    <div>
      <TreeView
        aria-label="Long list"
        items={longItems}
        selectionMode="multiple"
        height={240}
        style={{ width: 420 }}
      />
    </div>
  );

  // Move focus into the tree and arrow down to a row well past the initial
  // ~8-row window (height 240 / ~32px per row).
  // `exact` avoids matching "Item 10"/"Item 11"/… when we want "Item 1".
  await component.getByRole('row', { name: 'Item 1', exact: true }).click();
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('ArrowDown');
  }

  // The row far down the list is both rendered and focused: keyboard users can
  // navigate the full list even though most rows are windowed out.
  const focusedRow = component.getByRole('row', {
    name: 'Item 41',
    exact: true
  });
  await expect(focusedRow).toBeVisible();
  await expect(focusedRow).toBeFocused();

  // Scroll to the end without moving focus; react-aria must not drop focus even
  // as the focused row is scrolled out of view.
  await component
    .getByRole('treegrid')
    .evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await expect(focusedRow).toBeFocused();
});

test('should have screenshot for TreeView cascade selection', async ({
  mount,
  page
}) => {
  const component = await mount(
    <TreeView
      aria-label="Food categories"
      items={items}
      selectionMode="multiple"
      cascadeSelect
      defaultExpandedKeys={['1']}
    />
  );
  // Cascade: checking the parent checks all of its children.
  await component.getByRole('checkbox', { name: 'Fruits' }).click();
  await expect(component).toHaveScreenshot('tree-view-cascade-selection');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--tree-view-cascade-selection');
});

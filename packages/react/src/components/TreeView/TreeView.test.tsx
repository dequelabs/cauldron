import React from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import userEvent from '@testing-library/user-event';
import axe from '../../axe';
import TreeView, { TreeViewNode } from '../../../src/components/TreeView';

const items: TreeViewNode[] = [
  {
    id: '1',
    textValue: 'TreeView',
    children: [
      { id: '2', textValue: 'pizza' },
      { id: '3', textValue: 'pie' }
    ]
  },
  {
    id: '4',
    textValue: 'Another One',
    children: [
      { id: '5', textValue: 'foo' },
      { id: '6', textValue: 'bar' }
    ]
  }
];

test('renders tree items', () => {
  const { getByRole } = render(
    <TreeView aria-label="Test TreeView" items={items} />
  );
  expect(getByRole('row', { name: 'TreeView' })).toBeInTheDocument();
  expect(getByRole('row', { name: 'Another One' })).toBeInTheDocument();
});

test('selects a tree item on click', async () => {
  const { getByRole } = render(
    <TreeView aria-label="Test TreeView" items={items} selectionMode="single" />
  );
  const item = getByRole('row', { name: 'TreeView' });
  await userEvent.click(item);
  expect(item).toHaveAttribute('aria-selected', 'true');
});

test('selects a checkbox when clicked', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
    />
  );
  const checkbox = getByRole('checkbox', { name: 'TreeView' });
  await userEvent.click(checkbox);
  expect(checkbox).toBeChecked();
});

test('calls onAction when a tree item is activated', async () => {
  const onAction = jest.fn();
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      onAction={onAction}
      selectionMode="single"
    />
  );
  await userEvent.click(getByRole('row', { name: 'TreeView' }));
  expect(onAction).toHaveBeenCalled();
});

test('only one item can be selected in single selection mode', async () => {
  const { getByRole } = render(
    <TreeView aria-label="Test TreeView" items={items} selectionMode="single" />
  );
  const item1 = getByRole('row', { name: 'TreeView' });
  const item2 = getByRole('row', { name: 'Another One' });
  await userEvent.click(item1);
  expect(item1).toHaveAttribute('aria-selected', 'true');
  await userEvent.click(item2);
  expect(item2).toHaveAttribute('aria-selected', 'true');
  expect(item1).not.toHaveAttribute('aria-selected', 'true');
});

test('multiple items can be selected in multiple selection mode', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
    />
  );
  const checkbox1 = getByRole('checkbox', { name: 'TreeView' });
  const checkbox2 = getByRole('checkbox', { name: 'Another One' });
  await userEvent.click(checkbox1);
  await userEvent.click(checkbox2);
  expect(checkbox1).toBeChecked();
  expect(checkbox2).toBeChecked();
});

test('children are rendered when treeview is open', () => {
  const { getByRole, queryByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      defaultExpandedKeys={['1']}
    />
  );
  expect(getByRole('row', { name: 'pizza' })).toBeInTheDocument();
  expect(getByRole('row', { name: 'pie' })).toBeInTheDocument();
  expect(queryByRole('row', { name: 'foo' })).toBeNull();
  expect(queryByRole('row', { name: 'bar' })).toBeNull();
});

test('multiple treeviews can be open at once', () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      defaultExpandedKeys={['1', '4']}
    />
  );
  expect(getByRole('row', { name: 'pizza' })).toBeInTheDocument();
  expect(getByRole('row', { name: 'pie' })).toBeInTheDocument();
  expect(getByRole('row', { name: 'foo' })).toBeInTheDocument();
  expect(getByRole('row', { name: 'bar' })).toBeInTheDocument();
});

test('ArrowDown moves focus to next tree item', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      defaultExpandedKeys={['1']}
    />
  );
  const first = getByRole('row', { name: 'TreeView' });
  first.focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getByRole('row', { name: 'pizza' })).toHaveFocus();
});

test('ArrowUp moves focus to previous tree item', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      defaultExpandedKeys={['1']}
    />
  );
  getByRole('row', { name: 'TreeView' }).focus();
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowUp}');
  expect(getByRole('row', { name: 'TreeView' })).toHaveFocus();
});

test('ArrowRight expands a collapsed node', async () => {
  const { getByRole, queryByRole } = render(
    <TreeView aria-label="Test TreeView" items={items} />
  );
  expect(queryByRole('row', { name: 'pizza' })).toBeNull();
  getByRole('row', { name: 'TreeView' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getByRole('row', { name: 'pizza' })).toBeInTheDocument();
});

test('ArrowLeft collapses an expanded node', async () => {
  const { getByRole, queryByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      defaultExpandedKeys={['1']}
    />
  );
  expect(getByRole('row', { name: 'pizza' })).toBeInTheDocument();
  getByRole('row', { name: 'TreeView' }).focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(queryByRole('row', { name: 'pizza' })).toBeNull();
});

test('has no axe violations with default render', async () => {
  const { container } = render(
    <TreeView aria-label="Test TreeView" items={items} />
  );
  expect(await axe(container)).toHaveNoViolations();
});

test('has no axe violations with single selection mode', async () => {
  const { container } = render(
    <TreeView aria-label="Test TreeView" items={items} selectionMode="single" />
  );
  expect(await axe(container)).toHaveNoViolations();
});

test('has no axe violations with multiple selection mode', async () => {
  const { container } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
    />
  );
  expect(await axe(container)).toHaveNoViolations();
});

test('has no axe violations with expanded items', async () => {
  const { container } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      defaultExpandedKeys={['1', '4']}
    />
  );
  expect(await axe(container)).toHaveNoViolations();
});

test('deselects only the clicked item when multiple items are selected via onAction', async () => {
  const onAction = jest.fn();
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      onAction={onAction}
    />
  );
  const item1 = getByRole('row', { name: 'TreeView' });
  const item2 = getByRole('row', { name: 'Another One' });
  await userEvent.click(item1);
  await userEvent.click(item2);
  expect(item1).toHaveAttribute('aria-selected', 'true');
  expect(item2).toHaveAttribute('aria-selected', 'true');
  await userEvent.click(item1);
  expect(item1).not.toHaveAttribute('aria-selected', 'true');
  expect(item2).toHaveAttribute('aria-selected', 'true');
});

test('supports aria-labelledby', () => {
  const { getByRole } = render(
    <>
      <span id="tree-label">My Tree</span>
      <TreeView aria-labelledby="tree-label" items={items} />
    </>
  );
  expect(getByRole('treegrid', { name: 'My Tree' })).toBeInTheDocument();
});

const ssrItems: TreeViewNode[] = [
  {
    id: '1',
    textValue: 'Documents',
    children: [
      { id: '2', textValue: 'readme.md' },
      { id: '3', textValue: 'notes.txt' }
    ]
  },
  {
    id: '4',
    textValue: 'Photos',
    children: [{ id: '5', textValue: 'image.png' }]
  }
];

test('renders without error in SSR (no selection)', () => {
  const html = renderToString(<TreeView aria-label="Files" items={ssrItems} />);
  expect(html).toMatchSnapshot();
});

test('renders without error in SSR (single selection)', () => {
  const html = renderToString(
    <TreeView aria-label="Files" items={ssrItems} selectionMode="single" />
  );
  expect(html).toMatchSnapshot();
});

test('renders without error in SSR (multiple selection)', () => {
  const html = renderToString(
    <TreeView aria-label="Files" items={ssrItems} selectionMode="multiple" />
  );
  expect(html).toMatchSnapshot();
});

test('renders without error in SSR (expanded keys)', () => {
  const html = renderToString(
    <TreeView
      aria-label="Files"
      items={ssrItems}
      defaultExpandedKeys={['1', '4']}
    />
  );
  expect(html).toMatchSnapshot();
});

// Indeterminate / cascade behavior (multiple selection mode).
// Placed after the SSR snapshot tests so they don't shift the shared
// `react-id-generator` counter those snapshots depend on.

test('parent is indeterminate when only some children are selected', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      selectionStrategy="cascade"
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));

  const parent = getByRole('checkbox', { name: 'TreeView' });
  expect(parent).toBePartiallyChecked();
  expect(parent).not.toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).not.toBeChecked();
});

test('parent becomes checked (not indeterminate) when all children are selected', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      selectionStrategy="cascade"
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  await userEvent.click(getByRole('checkbox', { name: 'pie' }));

  const parent = getByRole('checkbox', { name: 'TreeView' });
  expect(parent).toBeChecked();
  expect(parent).not.toBePartiallyChecked();
});

test('selecting a parent cascades selection to all of its children', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      selectionStrategy="cascade"
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));

  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).toBeChecked();
});

test('clicking an indeterminate parent selects all of its children', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      selectionStrategy="cascade"
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBePartiallyChecked();

  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).toBeChecked();
});

test('deselecting a child reverts the parent from checked to indeterminate', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      selectionStrategy="cascade"
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();

  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBePartiallyChecked();
  expect(getByRole('checkbox', { name: 'TreeView' })).not.toBeChecked();
});

test('cascade is inert in single selection mode', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="single"
      selectionStrategy="cascade"
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  expect(
    getByRole('checkbox', { name: 'TreeView' })
  ).not.toBePartiallyChecked();
});

test('without cascade, multiple selection is independent and never indeterminate', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      defaultExpandedKeys={['1']}
    />
  );
  // Selecting one child does not select its sibling and does not mark the parent.
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).not.toBeChecked();
  expect(
    getByRole('checkbox', { name: 'TreeView' })
  ).not.toBePartiallyChecked();
  expect(getByRole('checkbox', { name: 'TreeView' })).not.toBeChecked();

  // Selecting the parent does not cascade to its children.
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).not.toBeChecked();
});

test('Ctrl+A select-all is preserved when toggling a single item (no lost selections)', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      defaultExpandedKeys={['1', '4']}
    />
  );
  // Select everything via react-aria's built-in Ctrl+A.
  getByRole('row', { name: 'TreeView' }).focus();
  await userEvent.keyboard('{Control>}a{/Control}');
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'foo' })).toBeChecked();

  // Toggling one item off must not drop the rest (the 'all' -> empty-set bug).
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  expect(getByRole('checkbox', { name: 'pizza' })).not.toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'foo' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'bar' })).toBeChecked();
});

test('Space toggles cascading selection on the focused parent', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      selectionStrategy="cascade"
      defaultExpandedKeys={['1']}
    />
  );
  getByRole('row', { name: 'TreeView' }).focus();
  await userEvent.keyboard('{ }');

  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).toBeChecked();
});

test('has no axe violations in the cascading indeterminate state', async () => {
  const { container, getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      selectionStrategy="cascade"
      defaultExpandedKeys={['1']}
    />
  );
  // Put a parent into the indeterminate (mixed) state.
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBePartiallyChecked();

  expect(await axe(container)).toHaveNoViolations();
});

// --- Exclusive strategy (parent/child mutually exclusive) ---

test('exclusive: selecting a parent deselects its children', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      selectionStrategy="exclusive"
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();

  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).not.toBeChecked();
});

test('exclusive: selecting a child deselects the parent and marks it indeterminate', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      selectionStrategy="exclusive"
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();

  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'TreeView' })).not.toBeChecked();
  expect(getByRole('checkbox', { name: 'TreeView' })).toBePartiallyChecked();
});

test('exclusive: a parent with all children selected is still not checked', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      selectionStrategy="exclusive"
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  await userEvent.click(getByRole('checkbox', { name: 'pie' }));
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).toBeChecked();
  // Independent of its children: the parent never auto-checks.
  expect(getByRole('checkbox', { name: 'TreeView' })).not.toBeChecked();
  expect(getByRole('checkbox', { name: 'TreeView' })).toBePartiallyChecked();
});

test('exclusive: selecting a deep node clears both ancestors and descendants', async () => {
  const deepItems: TreeViewNode[] = [
    {
      id: 'a',
      textValue: 'Region',
      children: [
        {
          id: 'b',
          textValue: 'Country',
          children: [{ id: 'c', textValue: 'State' }]
        }
      ]
    }
  ];
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={deepItems}
      selectionMode="multiple"
      selectionStrategy="exclusive"
      defaultExpandedKeys={['a', 'b']}
    />
  );
  // Select the top ancestor.
  await userEvent.click(getByRole('checkbox', { name: 'Region' }));
  expect(getByRole('checkbox', { name: 'Region' })).toBeChecked();

  // Selecting the deep descendant clears the ancestor chain.
  await userEvent.click(getByRole('checkbox', { name: 'State' }));
  expect(getByRole('checkbox', { name: 'State' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'Region' })).not.toBeChecked();
  expect(getByRole('checkbox', { name: 'Country' })).not.toBeChecked();
});

// --- Locked nodes ---

test('locked nodes cannot be selected', async () => {
  const lockedItems: TreeViewNode[] = [
    {
      id: '1',
      textValue: 'Parent',
      children: [
        { id: '2', textValue: 'Open' },
        { id: '3', textValue: 'Locked', locked: true }
      ]
    }
  ];
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={lockedItems}
      selectionMode="multiple"
      defaultExpandedKeys={['1']}
    />
  );
  const locked = getByRole('checkbox', { name: 'Locked' });
  expect(locked).toBeDisabled();

  await userEvent.click(locked);
  expect(locked).not.toBeChecked();

  // A non-locked sibling still selects normally.
  await userEvent.click(getByRole('checkbox', { name: 'Open' }));
  expect(getByRole('checkbox', { name: 'Open' })).toBeChecked();
});

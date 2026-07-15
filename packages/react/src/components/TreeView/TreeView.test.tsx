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

// --- Cascade selection (cascadeSelect / cascadeDeselect) ---

test('cascadeSelect: selecting a parent selects all of its children', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      cascadeSelect
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).toBeChecked();
});

test('cascadeSelect without cascadeDeselect: unchecking a parent leaves children selected', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      cascadeSelect
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).not.toBeChecked();
  // Children stay selected — deselection does not cascade.
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).toBeChecked();
});

test('cascadeDeselect: unchecking a parent deselects all of its children', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      cascadeDeselect
      defaultExpandedKeys={['1']}
    />
  );
  // No cascadeSelect: select children individually, then the parent.
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  await userEvent.click(getByRole('checkbox', { name: 'pie' }));
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();

  // Unchecking the parent cascades the deselection to its children.
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).not.toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).not.toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).not.toBeChecked();
});

test('cascadeDeselect without cascadeSelect: selecting a parent does not select children', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      cascadeDeselect
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).not.toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).not.toBeChecked();
});

test('no cascade by default: parent and children select independently', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).not.toBeChecked();
});

test('no indeterminate state: selecting one child never marks the parent', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      cascadeSelect
      cascadeDeselect
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'pizza' }));
  const parent = getByRole('checkbox', { name: 'TreeView' });
  expect(parent).not.toBeChecked();
  expect(parent).not.toBePartiallyChecked();
});

// --- Disabled nodes ---

const disabledItems: TreeViewNode[] = [
  {
    id: '1',
    textValue: 'Group',
    children: [
      { id: '2', textValue: 'Open' },
      { id: '3', textValue: 'Locked', disabled: true }
    ]
  }
];

test('disabled nodes cannot be selected', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={disabledItems}
      selectionMode="multiple"
      defaultExpandedKeys={['1']}
    />
  );
  const disabled = getByRole('checkbox', { name: 'Locked' });
  expect(disabled).toBeDisabled();
  await userEvent.click(disabled);
  expect(disabled).not.toBeChecked();
});

test('cascadeSelect skips disabled descendants', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={disabledItems}
      selectionMode="multiple"
      cascadeSelect
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'Group' }));
  expect(getByRole('checkbox', { name: 'Open' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'Locked' })).not.toBeChecked();
});

test('cascade is inert in single selection mode', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="single"
      cascadeSelect
      cascadeDeselect
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).not.toBeChecked();
});

// --- Virtualized (height) mode ---

test('applies a fixed height and the virtualized class when height is set', () => {
  const { getByRole } = render(
    <TreeView aria-label="Test TreeView" items={items} height={200} />
  );
  const tree = getByRole('treegrid');
  expect(tree).toHaveClass('TreeView--virtualized');
  expect(tree).toHaveStyle({ height: '200px' });
});

test('does not virtualize when height is omitted', () => {
  const { getByRole } = render(
    <TreeView aria-label="Test TreeView" items={items} />
  );
  expect(getByRole('treegrid')).not.toHaveClass('TreeView--virtualized');
});

test('does not virtualize when height is 0 (treated as unset)', () => {
  const { getByRole } = render(
    <TreeView aria-label="Test TreeView" items={items} height={0} />
  );
  const tree = getByRole('treegrid');
  expect(tree).not.toHaveClass('TreeView--virtualized');
  expect(tree).not.toHaveStyle({ height: '0px' });
});

test('merges a caller-supplied style with the virtualization height', () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      height={200}
      // style arrives via the react-aria passthrough; height must survive it.
      {...({ style: { border: '1px solid red' } } as object)}
    />
  );
  const tree = getByRole('treegrid');
  expect(tree).toHaveStyle({ height: '200px' });
  expect(tree).toHaveStyle({ border: '1px solid red' });
});

test('accepts a string height', () => {
  const { getByRole } = render(
    <TreeView aria-label="Test TreeView" items={items} height="20rem" />
  );
  expect(getByRole('treegrid')).toHaveStyle({ height: '20rem' });
});

test('renders and selects items when virtualized', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      height={200}
    />
  );
  const checkbox = getByRole('checkbox', { name: 'TreeView' });
  await userEvent.click(checkbox);
  expect(checkbox).toBeChecked();
});

test('has no axe violations when virtualized', async () => {
  const { container } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      height={200}
      defaultExpandedKeys={['1', '4']}
    />
  );
  expect(await axe(container)).toHaveNoViolations();
});

test('cascadeSelect works when virtualized: selecting the parent selects its children', async () => {
  const { getByRole } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      selectionMode="multiple"
      cascadeSelect
      cascadeDeselect
      height={200}
      defaultExpandedKeys={['1']}
    />
  );
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).toBeChecked();

  // cascadeDeselect: unchecking the parent clears its children too.
  await userEvent.click(getByRole('checkbox', { name: 'TreeView' }));
  expect(getByRole('checkbox', { name: 'TreeView' })).not.toBeChecked();
  expect(getByRole('checkbox', { name: 'pizza' })).not.toBeChecked();
  expect(getByRole('checkbox', { name: 'pie' })).not.toBeChecked();
});

import React from 'react';
import { render } from '@testing-library/react';
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

test('supports aria-labelledby', () => {
  const { getByRole } = render(
    <>
      <span id="tree-label">My Tree</span>
      <TreeView aria-labelledby="tree-label" items={items} />
    </>
  );
  expect(getByRole('treegrid', { name: 'My Tree' })).toBeInTheDocument();
});

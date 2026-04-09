import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
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
  const { getByText } = render(
    <TreeView aria-label="Test TreeView" items={items} />
  );
  expect(getByText('TreeView')).toBeInTheDocument();
  expect(getByText('Another One')).toBeInTheDocument();
});

test('selects a tree item on click', async () => {
  const { getByText } = render(
    <TreeView aria-label="Test TreeView" items={items} selectionMode="single" />
  );
  const child1 = getByText('TreeView');
  await userEvent.click(child1);
  expect(child1.closest('[aria-selected="true"]')).toBeTruthy();
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
  const { getByText } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      onAction={onAction}
      selectionMode="single"
    />
  );
  await userEvent.click(getByText('TreeView'));
  expect(onAction).toHaveBeenCalled();
});

test('only one item can be selected in single selection mode', async () => {
  const { getByText } = render(
    <TreeView aria-label="Test TreeView" items={items} selectionMode="single" />
  );
  const item1 = getByText('TreeView');
  const item2 = getByText('Another One');
  await userEvent.click(item1);
  expect(item1.closest('[aria-selected="true"]')).toBeTruthy();
  await userEvent.click(item2);
  expect(item2.closest('[aria-selected="true"]')).toBeTruthy();
  expect(item1.closest('[aria-selected="true"]')).toBeFalsy();
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
  const { getByText, queryByText } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      defaultExpandedKeys={['1']}
    />
  );
  expect(getByText('pizza')).toBeInTheDocument();
  expect(getByText('pie')).toBeInTheDocument();
  expect(queryByText('foo')).toBeNull();
  expect(queryByText('bar')).toBeNull();
});

test('multiple treeviews can be open at once', () => {
  const { getByText } = render(
    <TreeView
      aria-label="Test TreeView"
      items={items}
      defaultExpandedKeys={['1', '4']}
    />
  );
  expect(getByText('pizza')).toBeInTheDocument();
  expect(getByText('pie')).toBeInTheDocument();
  expect(getByText('foo')).toBeInTheDocument();
  expect(getByText('bar')).toBeInTheDocument();
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

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TreeView, { TreeViewFileType } from '../../../src/components/TreeView';

const items: TreeViewFileType[] = [
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
    <TreeView ariaLabel="Test TreeView" items={items} />
  );
  expect(getByText('TreeView')).toBeInTheDocument();
  expect(getByText('Another One')).toBeInTheDocument();
});

test('selects a tree item on click', () => {
  const { getByText } = render(
    <TreeView ariaLabel="Test TreeView" items={items} selectionMode="single" />
  );
  const child1 = getByText('TreeView');
  fireEvent.click(child1);
  expect(child1.closest('[aria-selected="true"]')).toBeTruthy();
});

test('selects a checkbox when clicked', () => {
  const { getAllByLabelText } = render(
    <TreeView
      ariaLabel="Test TreeView"
      items={items}
      selectionMode="multiple"
    />
  );
  const checkbox = getAllByLabelText('TreeView')[1];
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
});

test('calls onAction when a tree item is activated', () => {
  const onAction = jest.fn();
  const { getByText } = render(
    <TreeView
      ariaLabel="Test TreeView"
      items={items}
      onAction={onAction}
      selectionMode="single"
    />
  );
  fireEvent.click(getByText('TreeView'));
  expect(onAction).toHaveBeenCalled();
});

test('only one item can be selected in single selection mode', () => {
  const { getByText } = render(
    <TreeView ariaLabel="Test TreeView" items={items} selectionMode="single" />
  );
  const item1 = getByText('TreeView');
  const item2 = getByText('Another One');
  fireEvent.click(item1);
  expect(item1.closest('[aria-selected="true"]')).toBeTruthy();
  fireEvent.click(item2);
  expect(item2.closest('[aria-selected="true"]')).toBeTruthy();
  expect(item1.closest('[aria-selected="true"]')).toBeFalsy();
});

test('multiple items can be selected in multiple selection mode', () => {
  const { getAllByLabelText } = render(
    <TreeView
      ariaLabel="Test TreeView"
      items={items}
      selectionMode="multiple"
    />
  );
  const checkbox1 = getAllByLabelText('TreeView')[1];
  const checkbox2 = getAllByLabelText('Another One')[1];
  fireEvent.click(checkbox1);
  fireEvent.click(checkbox2);
  expect(checkbox1).toBeChecked();
  expect(checkbox2).toBeChecked();
});

test('children are rendered when treeview is open', () => {
  const { getByText, queryByText } = render(
    <TreeView
      ariaLabel="Test TreeView"
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
      ariaLabel="Test TreeView"
      items={items}
      defaultExpandedKeys={['1', '4']}
    />
  );
  expect(getByText('pizza')).toBeInTheDocument();
  expect(getByText('pie')).toBeInTheDocument();
  expect(getByText('foo')).toBeInTheDocument();
  expect(getByText('bar')).toBeInTheDocument();
});

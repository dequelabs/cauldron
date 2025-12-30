import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TreeView, { TreeViewFileType } from '.';

const items: TreeViewFileType[] = [
  {
    id: '1',
    textValue: 'Root',
    children: [
      { id: '2', textValue: 'Child 1' },
      { id: '3', textValue: 'Child 2' }
    ]
  }
];

test('renders tree items', () => {
  const { getByText } = render(<TreeView items={items} />);
  expect(getByText('Root')).toBeInTheDocument();
  expect(getByText('Child 1')).toBeInTheDocument();
  expect(getByText('Child 2')).toBeInTheDocument();
});

test('selects a tree item on click', () => {
  const { getByText } = render(
    <TreeView items={items} selectionMode="single" />
  );
  const child1 = getByText('Child 1');
  fireEvent.click(child1);
  expect(child1.closest('[aria-selected="true"]')).toBeTruthy();
});

test('checks a checkbox when clicked', () => {
  const { getByLabelText } = render(
    <TreeView items={items} selectionMode="multiple" />
  );
  const checkbox = getByLabelText('Root');
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
});

test('calls onAction when a tree item is activated', () => {
  const onAction = jest.fn();
  const { getByText } = render(
    <TreeView items={items} onAction={onAction} selectionMode="single" />
  );
  fireEvent.click(getByText('Root'));
  expect(onAction).toHaveBeenCalled();
});

import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import ActionList from './ActionList';
import ActionListItem from './ActionListItem';

test('should render children in a list', () => {
  render(
    <ActionList>
      <ActionListItem>Item 1</ActionListItem>
      <ActionListItem>Item 2</ActionListItem>
    </ActionList>
  );

  expect(screen.getByRole('list')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
});

test('should render with menu role', () => {
  render(
    <ActionList role="menu">
      <ActionListItem>Item 1</ActionListItem>
    </ActionList>
  );

  expect(screen.getByRole('menu')).toBeInTheDocument();
});

test('should apply className prop', () => {
  render(
    <ActionList className="custom-class">
      <ActionListItem>Item 1</ActionListItem>
    </ActionList>
  );

  expect(screen.getByRole('list')).toHaveClass('ActionList', 'custom-class');
});

test('should forward ref to underlying list element', () => {
  const ref = createRef<HTMLUListElement>();
  render(
    <ActionList ref={ref}>
      <ActionListItem>Item 1</ActionListItem>
    </ActionList>
  );

  expect(ref.current).toEqual(screen.getByRole('list'));
});

test('should call onAction when item action fires', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(
    <ActionList onAction={onAction}>
      <ActionListItem actionKey="item-1">Item 1</ActionListItem>
    </ActionList>
  );

  await user.click(screen.getByRole('listitem'));
  expect(onAction).toHaveBeenCalledWith('item-1', expect.anything());
});

test('should have no axe violations', async () => {
  const { container } = render(
    <ActionList aria-label="Actions">
      <ActionListItem>Item 1</ActionListItem>
      <ActionListItem>Item 2</ActionListItem>
    </ActionList>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

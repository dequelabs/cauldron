import React, { createRef } from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { ActionListProvider } from './ActionListContext';
import ActionList from './ActionList';
import ActionListItem from './ActionListItem';
import ActionListGroup from './ActionListGroup';

const withActionListRoleMenu = ({ children }: React.PropsWithChildren) => (
  <ActionListProvider role="menu" selectionType={null}>
    <ActionList role="menu">{children}</ActionList>
  </ActionListProvider>
);

const withActionListRoleListbox = ({ children }: React.PropsWithChildren) => (
  <ActionListProvider role="listbox" selectionType={null}>
    <ActionList role="menu">{children}</ActionList>
  </ActionListProvider>
);

const defaultProps: React.ComponentProps<typeof ActionListGroup> = {
  label: 'Group Name',
  children: [
    <ActionListItem key="1">One</ActionListItem>,
    <ActionListItem key="2">Two</ActionListItem>,
    <ActionListItem key="3">Three</ActionListItem>
  ]
};

test('should render as a list item', () => {
  render(<ActionListGroup data-testid="listitem" {...defaultProps} />);
  const listItem = screen.getByTestId('listitem');
  expect(listItem).toBeInTheDocument();
  expect(listItem).toHaveRole('listitem');
});

test('should render as a group when in menu context', () => {
  render(<ActionListGroup data-testid="listitem" {...defaultProps} />, {
    wrapper: withActionListRoleMenu
  });

  const listItem = screen.getByTestId('listitem');
  const group = within(listItem).getByRole('group');

  expect(listItem).toHaveRole('none');
  expect(group).toBeInTheDocument();
  expect(group).toHaveAccessibleName('Group Name');
});

test('should render as a group when in listbox context', () => {
  render(<ActionListGroup data-testid="listitem" {...defaultProps} />, {
    wrapper: withActionListRoleListbox
  });

  const listItem = screen.getByTestId('listitem');
  const group = within(listItem).getByRole('group');

  expect(listItem).toHaveRole('none');
  expect(group).toBeInTheDocument();
  expect(group).toHaveAccessibleName('Group Name');
});

test('should trigger onAction when an action list item is clicked within the group', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(<ActionListGroup onAction={onAction} {...defaultProps} />, {
    wrapper: withActionListRoleMenu
  });

  expect(onAction).not.toHaveBeenCalled();
  await user.click(screen.getByRole('menuitem', { name: 'One' }));
  await waitFor(() => {
    expect(onAction).toHaveBeenCalledWith('One', expect.anything());
  });
});

test('should set group id from props', () => {
  render(<ActionListGroup id="bananas" {...defaultProps} />);

  expect(screen.getByRole('presentation')).toHaveAttribute('id', 'bananas');
});

test('should support className prop', () => {
  render(
    <ActionListGroup
      data-testid="listitem"
      className="bananas"
      {...defaultProps}
    />
  );
  expect(screen.getByTestId('listitem')).toHaveClass('bananas');
});

test('should support ref prop', () => {
  const ref = createRef<HTMLLIElement>();
  render(
    <ActionListGroup ref={ref} data-testid="listitem" {...defaultProps} />
  );

  expect(ref.current).toBeInstanceOf(HTMLLIElement);
  expect(ref.current).toEqual(screen.getByTestId('listitem'));
});

test('should have no axe violations', async () => {
  // Note: the default semantics for the action list group is as a listitem,
  // so we're just wrapping it inside of a ul to have the correct ancestry
  const { container } = render(
    <ul>
      <ActionListGroup {...defaultProps} />
    </ul>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when in menu context', async () => {
  const { container } = render(<ActionListGroup {...defaultProps} />, {
    wrapper: withActionListRoleMenu
  });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when in listbox context', async () => {
  const { container } = render(<ActionListGroup {...defaultProps} />, {
    wrapper: withActionListRoleListbox
  });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

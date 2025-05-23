import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import ActionListItem from './ActionListItem';
import { ActionListProvider } from './ActionListContext';

const withActionListContext =
  (props: Partial<React.ComponentProps<typeof ActionListProvider>>) =>
  ({ children }: React.PropsWithChildren) => (
    <ActionListProvider role="list" selectionType={null} {...props}>
      {children}
    </ActionListProvider>
  );

test('should render item with label', () => {
  render(<ActionListItem>Label Text</ActionListItem>);

  const item = screen.getByRole('listitem');
  expect(item).toBeInTheDocument();
  expect(item).toHaveClass('ActionListItem');
  expect(within(item).getByText('Label Text')).toBeInTheDocument();
});

test('should render item with leading icon', () => {
  render(<ActionListItem leadingIcon="add-user">Label Text</ActionListItem>);

  const item = screen.getByRole('listitem');
  expect(
    item.querySelector('.ActionListItem__leadingIcon')
  ).toBeInTheDocument();
});

test('should render item with trailing icon', () => {
  render(
    <ActionListItem trailingIcon="chevron-right">Label Text</ActionListItem>
  );

  const item = screen.getByRole('listitem');
  expect(
    item.querySelector('.ActionListItem__trailingIcon')
  ).toBeInTheDocument();
});

test('should render item with description', () => {
  render(
    <ActionListItem description="This is a description">
      Label Text
    </ActionListItem>
  );

  const description = within(screen.getByRole('listitem')).getByText(
    'This is a description'
  );
  expect(description).toBeInTheDocument();
  expect(description).toHaveClass('ActionListItem__description');
});

test('should support className prop', () => {
  render(<ActionListItem className="custom-class">Label Text</ActionListItem>);

  const item = screen.getByRole('listitem');
  expect(item).toHaveClass('ActionListItem');
  expect(item).toHaveClass('custom-class');
});

test('should support ref prop', () => {
  const ref = React.createRef<HTMLLIElement>();
  render(<ActionListItem ref={ref}>Label Text</ActionListItem>);

  const item = screen.getByRole('listitem');
  expect(ref.current).toBeTruthy();
  expect(ref.current).toEqual(item);
});

test('should call onAction when clicked', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(<ActionListItem onAction={onAction}>Label Text</ActionListItem>);

  await user.click(screen.getByRole('listitem'));
  expect(onAction).toHaveBeenCalled();
});

test('should have menuitem role when in menu context', () => {
  render(<ActionListItem>Label Text</ActionListItem>, {
    wrapper: withActionListContext({ role: 'menu' })
  });

  expect(screen.getByRole('menuitem')).toBeInTheDocument();
});

test('should have menuitemradio role when in menu context with single selection', () => {
  render(<ActionListItem>Label Text</ActionListItem>, {
    wrapper: withActionListContext({ role: 'menu', selectionType: 'single' })
  });

  expect(screen.getByRole('menuitemradio')).toBeInTheDocument();
});

test('should have menuitemcheckbox role when in menu context with multiple selection', () => {
  render(<ActionListItem>Label Text</ActionListItem>, {
    wrapper: withActionListContext({ role: 'menu', selectionType: 'multiple' })
  });

  expect(screen.getByRole('menuitemcheckbox')).toBeInTheDocument();
});

test('should have option role when in listbox context', () => {
  render(<ActionListItem>Label Text</ActionListItem>, {
    wrapper: withActionListContext({ role: 'listbox' })
  });

  expect(screen.getByRole('option')).toBeInTheDocument();
});

test('should show selection mark when selectionType is set and item is selected', () => {
  render(<ActionListItem selected>Label Text</ActionListItem>, {
    wrapper: withActionListContext({ role: 'menu', selectionType: 'single' })
  });

  const item = screen.getByRole('menuitemradio');
  expect(item.querySelector('.ActionListItem__selection')).toBeInTheDocument();
  expect(item).toHaveAttribute('aria-checked', 'true');
});

test('should use actionKey for onAction if provided', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(<ActionListItem actionKey="custom-key">Label Text</ActionListItem>, {
    wrapper: withActionListContext({ onAction })
  });

  const item = screen.getByRole('listitem');
  await user.click(item);
  expect(onAction).toHaveBeenCalledWith('custom-key', expect.anything());
});

test('should use text content for onAction if actionKey is not provided', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(<ActionListItem>Label Text</ActionListItem>, {
    wrapper: withActionListContext({ onAction })
  });

  const item = screen.getByRole('listitem');
  await user.click(item);
  expect(onAction).toHaveBeenCalledWith('Label Text', expect.anything());
});

test('should be disabled when disabled prop is true', () => {
  render(<ActionListItem disabled>Label Text</ActionListItem>);

  const item = screen.getByRole('listitem');
  expect(item).toHaveAttribute('aria-disabled', 'true');
});

test('should not call onAction when disabled', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(
    <ActionListItem disabled onAction={onAction}>
      Label Text
    </ActionListItem>
  );

  const item = screen.getByRole('listitem');
  await user.click(item);
  expect(onAction).not.toHaveBeenCalled();
});

test('should have no axe violations', async () => {
  // Note: the default semantics for the action list group is as a listitem,
  // so we're just wrapping it inside of a ul to have the correct ancestry
  const { container } = render(
    <ul>
      <ActionListItem>Label Text</ActionListItem>
    </ul>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when disabled', async () => {
  const { container } = render(
    <ul>
      <ActionListItem disabled>Label Text</ActionListItem>
    </ul>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when selected with single selection type', async () => {
  // Note: the default semantics for the action list group is as a listitem,
  // so we're just wrapping it inside of a ul menu to have the correct ancestry
  const { container } = render(
    <ul role="menu">
      <ActionListItem selected>Label Text</ActionListItem>
    </ul>,
    {
      wrapper: withActionListContext({ role: 'menu', selectionType: 'single' })
    }
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when selected with multiple selection type', async () => {
  // Note: the default semantics for the action list group is as a listitem,
  // so we're just wrapping it inside of a ul menu to have the correct ancestry
  const { container } = render(
    <ul role="menu">
      <ActionListItem selected>Label Text</ActionListItem>
    </ul>,
    {
      wrapper: withActionListContext({
        role: 'menu',
        selectionType: 'multiple'
      })
    }
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

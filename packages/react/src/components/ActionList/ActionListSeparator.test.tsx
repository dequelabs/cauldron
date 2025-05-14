import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ActionListProvider } from './ActionListContext';
import ActionList from './ActionList';
import ActionListSeparator from './ActionListSeparator';

const withActionListRoleList = ({ children }: React.PropsWithChildren) => (
  <ActionListProvider role="list" selectionType={null}>
    <ActionList>{children}</ActionList>
  </ActionListProvider>
);
const withActionListRoleListbox = ({ children }: React.PropsWithChildren) => (
  <ActionListProvider role="listbox" selectionType={null}>
    <ActionList>{children}</ActionList>
  </ActionListProvider>
);
const withActionListRoleMenu = ({ children }: React.PropsWithChildren) => (
  <ActionListProvider role="menu" selectionType={null}>
    <ActionList role="menu">{children}</ActionList>
  </ActionListProvider>
);

test('should not be visible to AT when in list context', () => {
  render(<ActionListSeparator data-testid="separator" />, {
    wrapper: withActionListRoleList
  });
  const separator = screen.getByTestId('separator');
  expect(separator).toHaveAttribute('aria-hidden', 'true');
  expect(separator).toHaveAttribute('role', 'presentation');
  expect(separator).toBeInTheDocument();
});

test('should not be visible to AT when in listbox context', () => {
  render(<ActionListSeparator data-testid="separator" />, {
    wrapper: withActionListRoleListbox
  });
  const separator = screen.getByTestId('separator');
  expect(separator).toHaveAttribute('aria-hidden', 'true');
  expect(separator).toHaveAttribute('role', 'presentation');
  expect(separator).toBeInTheDocument();
});

test('should be separator when in menu context', () => {
  render(<ActionListSeparator data-testid="separator" />, {
    wrapper: withActionListRoleMenu
  });
  const separator = screen.getByRole('separator');
  expect(separator).toBeInTheDocument();
  expect(separator).not.toHaveAttribute('aria-hidden', 'true');
});

test('should support className prop', () => {
  render(<ActionListSeparator className="bananas" data-testid="separator" />);
  expect(screen.getByTestId('separator')).toHaveClass(
    'ActionListSeparator',
    'bananas'
  );
});

test('should support ref prop', () => {
  const ref = createRef<HTMLLIElement>();
  render(<ActionListSeparator ref={ref} data-testid="separator" />);

  expect(ref.current).toBeInstanceOf(HTMLLIElement);
  expect(ref.current).toEqual(screen.getByTestId('separator'));
});

test('should have no axe violations', async () => {
  const { container } = render(<ActionListSeparator />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when in list context', async () => {
  const { container } = render(<ActionListSeparator />, {
    wrapper: withActionListRoleList
  });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when in listbox context', async () => {
  const { container } = render(<ActionListSeparator />, {
    wrapper: withActionListRoleListbox
  });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when in menu context', async () => {
  const { container } = render(<ActionListSeparator />, {
    wrapper: withActionListRoleMenu
  });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ActionListProvider } from './ActionListContext';
import ActionList from './ActionList';
import ActionListLinkItem from './ActionListLinkItem';

const withActionListRoleMenu = ({ children }: React.PropsWithChildren) => (
  <ActionListProvider role="menu" selectionType={null}>
    <ActionList role="menu">{children}</ActionList>
  </ActionListProvider>
);

beforeEach(() => {
  // prevent console.warn in component from getting invoked here
  jest.spyOn(console, 'warn').mockImplementation(() => null);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('should render as a link', () => {
  render(<ActionListLinkItem href="#">Link</ActionListLinkItem>);
  const link = screen.getByRole('link');
  expect(link).toBeInTheDocument();
  expect(link).toHaveAccessibleName('Link');
});

test('should render as menu item', () => {
  render(<ActionListLinkItem href="#">Link</ActionListLinkItem>, {
    wrapper: withActionListRoleMenu
  });
  expect(screen.getByRole('menuitem')).toBeInTheDocument();
});

test('should support className prop', () => {
  render(
    <ActionListLinkItem className="bananas" href="#">
      Link
    </ActionListLinkItem>
  );
  expect(screen.getByRole('link')).toHaveClass(
    'Link',
    'ActionListLinkItem',
    'bananas'
  );
});

test('should support ref prop', () => {
  const ref = createRef<HTMLAnchorElement>();
  render(<ActionListLinkItem ref={ref} data-testid="link" />);

  expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  expect(ref.current).toEqual(screen.getByTestId('link'));
});

test('should have no axe violations', async () => {
  const { container } = render(
    <ActionListLinkItem href="#">Link</ActionListLinkItem>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when in menu context', async () => {
  const { container } = render(
    <ActionListLinkItem href="#">Link</ActionListLinkItem>,
    {
      wrapper: withActionListRoleMenu
    }
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

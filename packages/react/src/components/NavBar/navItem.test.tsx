import React from 'react';
import { screen, render } from '@testing-library/react';
import NavBar, { NavItem } from './';
import axe from '../../axe';

test('should render without error', () => {
  render(
    <NavItem active={false}>
      <p data-testid="div">I am a child</p>
    </NavItem>
  );

  expect(screen.getByTestId('div')).toBeInTheDocument();
});

test('should render children', () => {
  render(
    <NavItem active={false}>
      <p>I am a child</p>
    </NavItem>
  );

  expect(screen.getByText('I am a child')).toBeInTheDocument();
});

test('should handle active prop properly', () => {
  render(
    <NavItem active>
      <p>I am a child</p>
    </NavItem>
  );

  expect(screen.getByRole('listitem')).toHaveClass(
    'NavItem',
    'NavItem--active'
  );
});

test('should not set aria-current when inactive', () => {
  render(
    <NavItem active={false}>
      <p>I am a child</p>
    </NavItem>
  );

  expect(screen.getByRole('listitem').getAttribute('aria-current')).toBeNull();
});

test('should set aria-current when active', () => {
  render(
    <NavItem active>
      <p>I am a child</p>
    </NavItem>
  );

  expect(
    screen.getByRole('listitem').getAttribute('aria-current')
  ).not.toBeNull();
});

test('should allow aria-current to be overridden', () => {
  render(
    <NavItem active aria-current="page">
      <p>I am a child</p>
    </NavItem>
  );

  expect(screen.getByRole('listitem')).toHaveAttribute('aria-current', 'page');
});

test('returns no axe violations', async () => {
  const { container } = render(
    <NavBar>
      <NavItem active>
        <p>I am a child</p>
      </NavItem>
    </NavBar>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

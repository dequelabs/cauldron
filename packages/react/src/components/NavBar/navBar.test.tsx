import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import NavBar, { NavItem } from './';
import axe from '../../axe';

let wrapperNode: HTMLDivElement | null;
let mountNode: HTMLElement | null;

beforeEach(() => {
  wrapperNode = document.createElement('div');
  wrapperNode.innerHTML = `
      <a href="#foo" data-testid="link">Click Me!</a>
      <div id="#mount"></div>
    `;
  document.body.appendChild(wrapperNode);
  mountNode = document.getElementById('mount');
});

afterEach(() => {
  document.body.innerHTML = '';
  wrapperNode = null;
  mountNode = null;
});

test('should render without error', () => {
  render(
    <NavBar>
      <div />
    </NavBar>
  );
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});

test('should render with propId', () => {
  render(
    <NavBar propId="someid">
      <div />
    </NavBar>
  );
  expect(screen.getByRole('list')).toHaveAttribute('id', 'someid');
});

test('should render NavBar trigger button when collapsed prop is true', () => {
  render(
    <NavBar collapsed>
      <NavItem active={false}>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('button')).toHaveClass('NavBar__trigger');
  expect(screen.getByRole('button')).not.toHaveClass('NavBar__trigger--active');
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  expect(screen.getByRole('navigation').querySelector('.Icon')).toHaveClass(
    'Icon',
    'Icon--hamburger-menu'
  );
});

test('should render navTriggerLabel properly', () => {
  render(
    <NavBar collapsed navTriggerLabel="I am a label">
      <NavItem active={false}>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  expect(screen.getByRole('button')).toHaveAccessibleName('I am a label');
});

test('should render aria-controls prop on trigger button', () => {
  render(
    <NavBar collapsed propId="someid">
      <NavItem active={false}>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'someid');
});

test('should render aria-controls prop on trigger button', () => {
  render(
    <NavBar collapsed>
      <NavItem active>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('first item')).toBeInTheDocument();
});

test('should hide NavItems after pressing escape key', () => {
  render(
    <NavBar collapsed>
      <NavItem active>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  fireEvent.click(screen.getByRole('button'));
  fireEvent.keyDown(screen.getByRole('list'), { key: 'Escape' });
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
});

test('should not hide NavItems after pressing other keys', () => {
  render(
    <NavBar collapsed>
      <NavItem active>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  fireEvent.click(screen.getByRole('button'));
  fireEvent.keyDown(screen.getByRole('list'), { key: 'Home' });
  expect(screen.queryByRole('listitem')).toBeInTheDocument();
});

test('should hide NavItems when focusing outside nav', () => {
  render(
    <NavBar collapsed>
      <NavItem active>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  fireEvent.click(screen.getByTestId('link'));
  fireEvent.focusIn(screen.getByTestId('link'));
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
});

test('should not hide NavItems when focusing inside nav', () => {
  render(
    <NavBar collapsed>
      <NavItem active>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  fireEvent.click(screen.getByRole('button'));
  fireEvent.focusIn(screen.getByRole('listitem'));
  expect(screen.getByRole('listitem')).toBeInTheDocument();
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

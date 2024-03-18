import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../../lib';
import TopBar, { TopBarItem } from './';
import MenuBar from '../MenuBar/';
import axe from '../../axe';

global.MutationObserver = class {
  observe: jest.Mock;
  disconnect: jest.Mock;
  takeRecords: jest.Mock;
  trigger: unknown;

  constructor(handler: any) {
    this.observe = jest.fn();
    this.disconnect = jest.fn();
    this.takeRecords = jest.fn();
    this.trigger = handler;
  }
};

test('should render without errors', () => {
  render(
    <TopBar data-testid="topbar">
      <h1>Hello</h1>
    </TopBar>
  );

  expect(screen.getByTestId('topbar')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Hello' })).toBeInTheDocument();
});

test('should not render falsy children', () => {
  render(
    <TopBar>
      <div data-testid="child" />
      {false && <div data-testid="child2" />}
    </TopBar>
  );
  expect(screen.getByTestId('child')).toBeInTheDocument();
  expect(screen.queryByTestId('child2')).toBeNull();
});

test('returns no axe violations in dark mode', async () => {
  const { container } = render(
    <ThemeProvider initialTheme="dark">
      <TopBar>
        <div>LOGO</div>
        <MenuBar>
          <TopBarItem>1</TopBarItem>
          <TopBarItem>2</TopBarItem>
          <TopBarItem>3</TopBarItem>
        </MenuBar>
      </TopBar>
    </ThemeProvider>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns no axe violations in light mode', async () => {
  const { container } = render(
    <ThemeProvider initialTheme="light">
      <TopBar>
        <div>LOGO</div>
        <MenuBar>
          <TopBarItem>1</TopBarItem>
          <TopBarItem>2</TopBarItem>
          <TopBarItem>3</TopBarItem>
        </MenuBar>
      </TopBar>
    </ThemeProvider>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

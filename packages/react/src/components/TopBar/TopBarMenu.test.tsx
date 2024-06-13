import React from 'react';
import { OptionsMenuList } from '../OptionsMenu';
import { fireEvent, render, screen } from '@testing-library/react';
import TopBarMenu from './TopBarMenu';
import { MenuBar, TopBar } from '../..';
import { MenuItem } from '../../../lib';
import axe from '../../axe';

const [rightCode, leftCode, downCode] = [39, 37, 40];
const [rightKey, leftKey, downKey] = ['Right', 'Left', 'Down'];

const noop = () => {
  // not empty
};

const defaultProps = {
  id: 'foo'
};

const optionsMenu = (
  <OptionsMenuList onClose={noop}>
    <li>option 1</li>
    <li>option 2</li>
  </OptionsMenuList>
);

test('should render children', () => {
  render(<TopBarMenu {...defaultProps}>{optionsMenu}</TopBarMenu>);

  expect(
    screen.getByRole('menuitem', { name: 'option 1' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('menuitem', { name: 'option 2' })
  ).toBeInTheDocument();
});

test('should pass-through props', () => {
  render(
    <TopBarMenu {...defaultProps} title="foo">
      Menu
      {optionsMenu}
    </TopBarMenu>
  );

  const menu = screen.getByRole('menuitem', { name: /menu/i });
  expect(menu).toHaveAttribute('title', 'foo');
});

test('should open menu with down key', () => {
  render(
    <MenuBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps}>
        Menu
        {optionsMenu}
      </TopBarMenu>
      <MenuItem>b</MenuItem>
    </MenuBar>
  );

  const menu = screen.getByRole('menuitem', { name: /menu/i });

  fireEvent.keyDown(menu, {
    key: downKey,
    keyCode: downCode
  });

  expect(menu).toHaveAttribute('aria-expanded', 'true');
});

test('should call onKeyDown with down key', () => {
  const handleKeyDown = jest.fn();
  render(
    <MenuBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps} onKeyDown={handleKeyDown}>
        Menu
        {optionsMenu}
      </TopBarMenu>
      <MenuItem>b</MenuItem>
    </MenuBar>
  );

  const menu = screen.getByRole('menuitem', { name: /menu/i });

  fireEvent.keyDown(menu, {
    key: downKey,
    keyCode: downCode
  });

  expect(handleKeyDown).toBeCalled();
});

test('should close menu with left key', () => {
  render(
    <MenuBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps}>
        Menu
        {optionsMenu}
      </TopBarMenu>
      <MenuItem>b</MenuItem>
    </MenuBar>
  );

  const menu = screen.getByRole('menuitem', { name: /menu/i });

  // open menu
  fireEvent.click(menu);
  expect(menu).toHaveAttribute('aria-expanded', 'true');

  // close menu
  fireEvent.keyDown(menu, {
    key: leftKey,
    keyCode: leftCode
  });

  expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('should close menu with right key', () => {
  render(
    <MenuBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps}>
        Menu
        {optionsMenu}
      </TopBarMenu>
      <MenuItem>b</MenuItem>
    </MenuBar>
  );

  const menu = screen.getByRole('menuitem', { name: /menu/i });

  // open menu
  fireEvent.click(menu);
  expect(menu).toHaveAttribute('aria-expanded', 'true');

  // close menu
  fireEvent.keyDown(menu, {
    key: rightKey,
    keyCode: rightCode
  });

  expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <TopBar>
      <MenuBar>
        <MenuItem>a</MenuItem>
        <TopBarMenu {...defaultProps}>{optionsMenu}</TopBarMenu>
        <MenuItem>b</MenuItem>
      </MenuBar>
    </TopBar>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

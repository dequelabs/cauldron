import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuBar, TopBarMenu, TopBar, MenuItem, OptionsMenuList } from '../..';
import axe from '../../axe';

const [right, left, down] = [39, 37, 40];

const defaultProps = {
  id: 'foo'
};

const optionsMenu = (
  <OptionsMenuList>
    <li>option 1</li>
    <li>option 2</li>
  </OptionsMenuList>
);

test('should render children', () => {
  render(<TopBarMenu {...defaultProps}>{optionsMenu}</TopBarMenu>);

  expect(screen.getAllByRole('menuitem').length).toBeTruthy();
});

test('should pass-through props', () => {
  render(
    <TopBarMenu {...defaultProps} foo="bar" data-testid="TopBarMenu">
      {optionsMenu}
    </TopBarMenu>
  );

  expect(screen.getByTestId('TopBarMenu')).toHaveAttribute('foo', 'bar');
});

test('should open menu with down key', () => {
  render(
    <MenuBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps} data-testid="TopBarMenu">
        {optionsMenu}
      </TopBarMenu>
      <MenuItem>b</MenuItem>
    </MenuBar>
  );

  fireEvent.keyDown(screen.getByTestId('TopBarMenu'), { keyCode: down });

  expect(screen.getByRole('menu')).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menu')).toHaveClass(
    'OptionsMenu__list',
    'Dropdown',
    'Dropdown--active'
  );
});

test('should call onKeyDown with down key', () => {
  const handleKeyDown = jest.fn();

  render(
    <MenuBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu
        {...defaultProps}
        data-testid="TopBarMenu"
        onKeyDown={handleKeyDown}
      >
        {optionsMenu}
      </TopBarMenu>
      <MenuItem>b</MenuItem>
    </MenuBar>
  );

  fireEvent.keyDown(screen.getByTestId('TopBarMenu'), { keyCode: down });

  expect(handleKeyDown).toBeCalled();
});

test('should close menu with left key', () => {
  render(
    <MenuBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps} data-testid="TopBarMenu">
        {optionsMenu}
      </TopBarMenu>
      <MenuItem>b</MenuItem>
    </MenuBar>
  );

  fireEvent.keyDown(screen.getByTestId('TopBarMenu'), { keyCode: left });

  expect(screen.getByRole('menu')).not.toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menu')).not.toHaveClass(
    'OptionsMenu__list',
    'Dropdown',
    'Dropdown--active'
  );
});

test('should close menu with right key', () => {
  render(
    <MenuBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps} data-testid="TopBarMenu">
        {optionsMenu}
      </TopBarMenu>
      <MenuItem>b</MenuItem>
    </MenuBar>
  );

  fireEvent.keyDown(screen.getByTestId('TopBarMenu'), { keyCode: right });

  expect(screen.getByRole('menu')).not.toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menu')).not.toHaveClass(
    'OptionsMenu__list',
    'Dropdown',
    'Dropdown--active'
  );
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

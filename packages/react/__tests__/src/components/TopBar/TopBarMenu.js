import React from 'react';
import { mount } from 'enzyme';
import MenuItem from 'src/components/MenuItem';
import TopBar from 'src/components/TopBar/TopBar';
import TopBarMenu from 'src/components/TopBar/TopBarMenu';
import { OptionsMenuList } from 'src/components/OptionsMenu';
import axe from '../../../axe';

const [right, left, down] = [39, 37, 40];
const noop = () => {};

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
  const topBarMenu = mount(
    <TopBarMenu {...defaultProps}>{optionsMenu}</TopBarMenu>
  );
  expect(topBarMenu.find('OptionsMenuList').length).toBeTruthy();
});

test('should pass-through props', () => {
  const wrapper = mount(
    <TopBarMenu {...defaultProps} foo="bar">
      {optionsMenu}
    </TopBarMenu>
  );
  expect(wrapper.children().props().foo).toBe('bar');
});

test('should open menu with down key', () => {
  const wrapper = mount(
    <TopBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps}>{optionsMenu}</TopBarMenu>
      <MenuItem>b</MenuItem>
    </TopBar>
  );
  wrapper.setState({ focusIndex: 1 });
  const topBarMenu = wrapper.find('TopBarMenu');
  topBarMenu.simulate('keydown', { which: down });

  expect(topBarMenu.state().open).toBeTruthy();
});

test('should call onKeyDown with down key', () => {
  const handleKeyDown = jest.fn();
  const wrapper = mount(
    <TopBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps} onKeyDown={handleKeyDown}>
        {optionsMenu}
      </TopBarMenu>
      <MenuItem>b</MenuItem>
    </TopBar>
  );
  wrapper.setState({ focusIndex: 1 });
  const topBarMenu = wrapper.find('TopBarMenu');
  topBarMenu.simulate('keydown', { which: down });

  expect(handleKeyDown).toBeCalled();
});

test('should close menu with left key', () => {
  const wrapper = mount(
    <TopBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps}>{optionsMenu}</TopBarMenu>
      <MenuItem>b</MenuItem>
    </TopBar>
  );
  wrapper.setState({ focusIndex: 1 });
  const topBarMenu = wrapper.find('TopBarMenu');
  topBarMenu.setState({ open: true });
  topBarMenu.simulate('keydown', { which: left });

  expect(topBarMenu.state().open).toBeFalsy();
});

test('should close menu with right key', () => {
  const wrapper = mount(
    <TopBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps}>{optionsMenu}</TopBarMenu>
      <MenuItem>b</MenuItem>
    </TopBar>
  );
  wrapper.setState({ focusIndex: 1 });
  const topBarMenu = wrapper.find('TopBarMenu');
  topBarMenu.setState({ open: true });
  topBarMenu.simulate('keydown', { which: right });

  expect(topBarMenu.state().open).toBeFalsy();
});

test('should return no axe violations', async () => {
  const topbar = mount(
    <TopBar>
      <MenuItem>a</MenuItem>
      <TopBarMenu {...defaultProps}>{optionsMenu}</TopBarMenu>
      <MenuItem>b</MenuItem>
    </TopBar>
  );

  expect(await axe(topbar.html())).toHaveNoViolations();
});

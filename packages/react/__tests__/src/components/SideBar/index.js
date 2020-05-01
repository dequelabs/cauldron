import React from 'react';
import { mount } from 'enzyme';
import SideBar from 'src/components/SideBar';
import MenuItem from 'src/components/MenuItem';
import axe from '../../../axe';

const mountWrapper = (onDismiss = () => {}) =>
  mount(
    <SideBar onDismiss={onDismiss}>
      <MenuItem>a</MenuItem>
      <MenuItem>b</MenuItem>
      <MenuItem>c</MenuItem>
    </SideBar>
  );
const noop = () => {};

test('properly handles viewport resize', () => {
  expect.assertions(1);
  const wrapper = mountWrapper();
  wrapper.setState({ wide: false });
  // TODO: make this less fragile by mocking the isWide function
  wrapper.instance().onResize();
  expect(wrapper.state('wide')).toBe(true);
});

test('handles UP arrow', () => {
  expect.assertions(2);
  const wrapper = mountWrapper();
  const e = { which: 38, preventDefault: noop };

  // from 2nd to 1st
  wrapper.setState({ focusIndex: 1 });
  wrapper.instance().onKeyDown(e);
  expect(wrapper.state('focusIndex')).toBe(0);
  // from 1st to 3rd
  wrapper.setState({ focusIndex: 0 });
  wrapper.instance().onKeyDown(e);
  expect(wrapper.state('focusIndex')).toBe(2);
});

test('handles DOWN arrow', () => {
  expect.assertions(2);
  const wrapper = mountWrapper();
  const e = { which: 40, preventDefault: noop };

  // from 1st to 2nd
  wrapper.setState({ focusIndex: 0 });
  wrapper.instance().onKeyDown(e);
  expect(wrapper.state('focusIndex')).toBe(1);
  // from 3rd to 1st
  wrapper.setState({ focusIndex: 2 });
  wrapper.instance().onKeyDown(e);
  expect(wrapper.state('focusIndex')).toBe(0);
});

test('handles escape (calls onDismiss)', () => {
  expect.assertions(1);
  const onDismiss = jest.fn();
  const wrapper = mountWrapper(onDismiss);

  const e = { which: 27 };
  wrapper.instance().onKeyDown(e);
  expect(onDismiss).toBeCalled();
});

test('calls onDismiss when clicked outside', () => {
  const onDismiss = jest.fn();
  const wrapper = mountWrapper(onDismiss);
  wrapper.setState({ wide: false });
  wrapper.setProps({ show: true });

  wrapper.instance().handleClickOutside();

  expect(onDismiss).toBeCalled();
});

test.only('animates / toggles display given a show prop change', done => {
  const wrapper = mountWrapper();
  wrapper.setProps({ show: true });

  setTimeout(() => {
    expect(wrapper.state('animateClass')).toBe('dqpl-show dqpl-active');
    wrapper.setProps({ show: false });

    setTimeout(() => {
      expect(wrapper.state('animateClass')).toBe('');
      done();
    }, 101);
  }, 101); // wait for animation classes to get added
});

test('should return no axe violations', async () => {
  const sidebar = mount(
    <SideBar onDismiss={noop}>
      <MenuItem>Item 1</MenuItem>
      <MenuItem>Item 2</MenuItem>
      <MenuItem>Item 3</MenuItem>
    </SideBar>
  );
  expect(await axe(sidebar.html())).toHaveNoViolations();
});

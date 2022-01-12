import React from 'react';
import { mount } from 'enzyme';
import SideBar, { SideBarItem } from 'src/components/SideBar';
import axe from '../../../axe';

const mountWrapper = (onDismiss = () => {}) =>
  mount(
    <SideBar onDismiss={onDismiss}>
      <SideBarItem>a</SideBarItem>
      <SideBarItem>b</SideBarItem>
      <SideBarItem>c</SideBarItem>
    </SideBar>
  );
const noop = () => {};

test('passes navProps to nav', () => {
  const wrapper = mountWrapper();
  wrapper.setProps({
    navProps: {
      'aria-label': 'Side Bar'
    }
  });

  wrapper.update();
  expect(wrapper.find('nav').prop('aria-label')).toBe('Side Bar');
});

test('properly handles viewport resize', () => {
  expect.assertions(1);
  const wrapper = mountWrapper();
  wrapper.setState({ wide: false });
  // TODO: make this less fragile by mocking the isWide function
  wrapper.instance().handleResize();
  expect(wrapper.state('wide')).toBe(true);
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

test('animates / toggles display given a show prop change', done => {
  const wrapper = mountWrapper();
  wrapper.setProps({ show: true });

  setTimeout(() => {
    expect(wrapper.state('animateClass')).toBe('SideBar--show SideBar--active');
    wrapper.setProps({ show: false });

    setTimeout(() => {
      expect(wrapper.state('animateClass')).toBe('');
      done();
    }, 101);
  }, 100); // wait for animation classes to get added
});

test('should return no axe violations', async () => {
  const sidebar = mount(
    <SideBar onDismiss={noop}>
      <SideBarItem>Item 1</SideBarItem>
      <SideBarItem>Item 2</SideBarItem>
      <SideBarItem>Item 3</SideBarItem>
    </SideBar>
  );
  expect(await axe(sidebar.html())).toHaveNoViolations();
});

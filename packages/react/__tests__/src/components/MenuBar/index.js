import React from 'react';
import { mount, shallow } from 'enzyme';
import MenuBar from 'src/components/MenuBar';
import { TopBarItem } from 'src/';
import axe from '../../../axe';

const [right, left] = [39, 37];
const noop = () => {};

test('renders', () => {
  expect.assertions(1);
  expect(
    shallow(
      <MenuBar>
        <div />
      </MenuBar>
    )
  ).toBeTruthy();
});

test('supports falsy children', () => {
  expect.assertions(2);
  const wrapper = shallow(
    <MenuBar>
      <div />
      {false && <div />}
    </MenuBar>
  );
  expect(wrapper).toBeTruthy();
  expect(wrapper.children().length).toBe(1);
});

test('handles left arrow', () => {
  const mountElement = document.createElement('div');
  document.body.appendChild(mountElement);
  const wrapper = mount(
    <MenuBar>
      <TopBarItem>1</TopBarItem>
      <TopBarItem>2</TopBarItem>
      <TopBarItem>3</TopBarItem>
    </MenuBar>,
    { attachTo: mountElement }
  );
  const menuItems = wrapper.find('[role="menuitem"]');
  // from 2nd to 1st
  wrapper.instance().onKeyDown({
    which: left,
    preventDefault: noop,
    target: menuItems.at(1).getDOMNode()
  });
  expect(document.activeElement).toBe(menuItems.at(0).getDOMNode());
  // from 1st to 3rd (circularity)
  wrapper.instance().onKeyDown({
    which: left,
    preventDefault: noop,
    target: menuItems.at(0).getDOMNode()
  });
  expect(document.activeElement).toBe(menuItems.at(2).getDOMNode());
});

test('handles right arrow', () => {
  const mountElement = document.createElement('div');
  document.body.appendChild(mountElement);
  const wrapper = mount(
    <MenuBar>
      <TopBarItem>1</TopBarItem>
      <TopBarItem>2</TopBarItem>
      <TopBarItem>3</TopBarItem>
    </MenuBar>,
    { attachTo: mountElement }
  );
  const menuItems = wrapper.find('[role="menuitem"]');
  // from 1st to 2nd
  wrapper.instance().onKeyDown({
    which: right,
    preventDefault: noop,
    target: menuItems.at(0).getDOMNode()
  });
  expect(document.activeElement).toBe(menuItems.at(1).getDOMNode());
  // from 3rd to 1st (circularity)
  wrapper.instance().onKeyDown({
    which: right,
    preventDefault: noop,
    target: menuItems.at(2).getDOMNode()
  });
  expect(document.activeElement).toBe(menuItems.at(0).getDOMNode());
});

test('should pass-through classname', () => {
  const wrapper = mount(
    <MenuBar className="test">
      <TopBarItem>1</TopBarItem>
    </MenuBar>
  );
  expect(wrapper.children().props().className).toBe('test');
});

test('should return no axe violations', async () => {
  const topbar = mount(
    <MenuBar>
      <TopBarItem>1</TopBarItem>
      <TopBarItem>2</TopBarItem>
      <TopBarItem>3</TopBarItem>
    </MenuBar>
  );
  expect(await axe(topbar.html())).toHaveNoViolations();
});

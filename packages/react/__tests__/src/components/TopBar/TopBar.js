import React from 'react';
import { mount, shallow } from 'enzyme';
import TopBar from 'src/components/TopBar';
import { TopBarItem } from 'src/';
import axe from '../../../axe';

const [right, left] = [39, 37];
const noop = () => {};

test('renders', () => {
  expect.assertions(1);
  expect(
    shallow(
      <TopBar>
        <div />
      </TopBar>
    )
  ).toBeTruthy();
});

test('supports falsy children', () => {
  expect.assertions(2);
  const wrapper = shallow(
    <TopBar>
      <div />
      {false && <div />}
    </TopBar>
  );
  expect(wrapper).toBeTruthy();
  expect(wrapper.children().length).toBe(1);
});

test('handles left arrow', () => {
  const wrapper = mount(
    <TopBar>
      <TopBarItem>1</TopBarItem>
      <TopBarItem>2</TopBarItem>
      <TopBarItem>3</TopBarItem>
    </TopBar>
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
  const wrapper = mount(
    <TopBar>
      <TopBarItem>1</TopBarItem>
      <TopBarItem>2</TopBarItem>
      <TopBarItem>3</TopBarItem>
    </TopBar>
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

test('should return no axe violations', async () => {
  const topbar = mount(
    <TopBar>
      <TopBarItem>1</TopBarItem>
      <TopBarItem>2</TopBarItem>
      <TopBarItem>3</TopBarItem>
    </TopBar>
  );
  expect(await axe(topbar.html())).toHaveNoViolations();
});

import React from 'react';
import { mount } from 'enzyme';
import MenuItem from 'src/components/MenuItem';
import SideBar from 'src/components/SideBar';
import axe from '../../../axe';

test('clicks first direct child link given a click', () => {
  expect.assertions(1);
  let clicked = false;
  const wrapper = mount(
    <MenuItem>
      <a href="/foo">Foo</a>
    </MenuItem>
  );
  wrapper
    .find('a')
    .getDOMNode()
    // enzyme's simulate won't trigger an onClick on the above <a />
    .addEventListener('click', () => (clicked = true));

  wrapper.simulate('click');
  expect(clicked).toBeTruthy();
});

test('calls onClick prop', () => {
  expect.assertions(1);
  let clicked = false;
  const click = () => (clicked = true);
  mount(<MenuItem onClick={click}>BOOGNISH</MenuItem>).simulate('click');

  expect(clicked).toBeTruthy();
});

test('clicks the menuitem given enter/space keydowns', () => {
  expect.assertions(1);
  let clickCount = 0;
  const wrapper = mount(<MenuItem>BOOGNISH</MenuItem>);

  wrapper.instance().item = {
    click: () => clickCount++
  };

  wrapper.simulate('keydown', { which: 13 }); // ENTER
  wrapper.simulate('keydown', { which: 9999 }); // (nothing)
  wrapper.simulate('keydown', { which: 32 }); // SPACE
  expect(clickCount).toBe(2);
});

test('supports menuItemRef props', () => {
  expect.assertions(1);
  let called = false;
  const ref = () => (called = true);
  mount(<MenuItem menuItemRef={ref}>BOOGNISH</MenuItem>);
  expect(called).toBeTruthy();
});

test('should return no axe violations', async () => {
  const item = mount(
    <ul role="menubar">
      <MenuItem>Foo</MenuItem>
    </ul>
  );
  expect(await axe(item.html())).toHaveNoViolations();
});

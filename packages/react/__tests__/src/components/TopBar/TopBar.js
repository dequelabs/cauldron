import React from 'react';
import { mount, shallow } from 'enzyme';
import TopBar from 'src/components/TopBar';
import MenuBar from 'src/components/MenuBar';
import { TopBarItem } from 'src/';
import axe from '../../../axe';

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

test('should return no axe violations', async () => {
  const topbar = mount(
    <TopBar>
      <div>LOGO</div>
      <MenuBar>
        <TopBarItem>1</TopBarItem>
        <TopBarItem>2</TopBarItem>
        <TopBarItem>3</TopBarItem>
      </MenuBar>
    </TopBar>
  );
  expect(await axe(topbar.html())).toHaveNoViolations();
});

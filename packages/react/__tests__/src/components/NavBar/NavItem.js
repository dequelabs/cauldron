import React from 'react';
import { mount } from 'enzyme';
import { NavItem } from 'src/components/NavBar';

test('mounts without error', () => {
  expect(() =>
    mount(
      <NavItem>
        <div />
      </NavItem>
    )
  ).not.toThrow();
});

test('renders children', () => {
  const MountedNavItem = mount(
    <NavItem>
      <p>I am a child</p>
    </NavItem>
  );
  expect(MountedNavItem.find('p').text()).toEqual('I am a child');
});

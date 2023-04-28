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

test('handles active prop properly', () => {
  const MountedNavItem = mount(
    <NavItem active>
      <p>I am a child</p>
    </NavItem>
  );
  expect(MountedNavItem.find('.NavItem--active').exists()).toBe(true);
});

test('does not set aria-current when inactive', () => {
  const MountedNavItem = mount(
    <NavItem active>
      <p>I am a child</p>
    </NavItem>
  );

  expect(
    MountedNavItem.find('.NavItem--active[aria-current="true"]').exists()
  ).toBe(false);
});

test('sets aria-current when active', () => {
  const MountedNavItem = mount(
    <NavItem active>
      <p>I am a child</p>
    </NavItem>
  );
  expect(MountedNavItem.find('.NavItem--active').prop('aria-current')).toBe(
    true
  );
});

test('allows aria-current to be overridden', () => {
  const MountedNavItem = mount(
    <NavItem active aria-current="page">
      <p>I am a child</p>
    </NavItem>
  );

  expect(MountedNavItem.find('.NavItem--active').prop('aria-current')).toBe(
    'page'
  );
});

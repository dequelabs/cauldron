import React from 'react';
import { mount } from 'enzyme';
import NavBar, { NavItem } from 'src/components/NavBar';
import { act } from 'react-dom/test-utils';

let wrapperNode;
let mountNode;

beforeEach(() => {
  wrapperNode = document.createElement('div');
  wrapperNode.innerHTML = `
    <a href="#foo" data-test>Click Me!</a>
    <div id="#mount"></div>
  `;
  document.body.appendChild(wrapperNode);
  mountNode = document.getElementById('mount');
});

afterEach(() => {
  document.body.innerHTML = '';
  wrapperNode = null;
  mountNode = null;
});

test('mounts without error', () => {
  expect(() =>
    mount(
      <NavBar>
        <div />
      </NavBar>
    )
  ).not.toThrow();
});

test('renders className prop', () => {
  const MountedNavBar = mount(
    <NavBar className="find--me">
      <div />
    </NavBar>
  );
  expect(MountedNavBar.find('.find--me').exists()).toBe(true);
});

test('handles initialActiveIndex properly', () => {
  const MountedNavBar = mount(
    <NavBar initialActiveIndex={0}>
      <NavItem>
        <p>first item</p>
      </NavItem>
      <NavItem>
        <p>second item</p>
      </NavItem>
    </NavBar>
  );

  expect(
    MountedNavBar.find('NavItem')
      .at(0)
      .find('.NavItem--active')
      .exists()
  ).toBe(true);
  expect(
    MountedNavBar.find('NavItem')
      .at(1)
      .find('.NavItem--active')
      .exists()
  ).toBe(false);
});

test('activates a NavItem when it is clicked', () => {
  const MountedNavBar = mount(
    <NavBar>
      <NavItem>
        <p>first item</p>
      </NavItem>
      <NavItem>
        <p>second item</p>
      </NavItem>
    </NavBar>
  );

  MountedNavBar.find('NavItem')
    .at(0)
    .simulate('click');
  MountedNavBar.update();

  expect(
    MountedNavBar.find('NavItem')
      .at(0)
      .find('.NavItem--active')
      .exists()
  );
  expect(
    MountedNavBar.find('NavItem')
      .at(1)
      .find('.NavItem--active')
      .exists()
  ).toBe(false);
});

test('renders NavBarTrigger when collapsed prop is true', () => {
  const MountedNavBar = mount(
    <NavBar collapsed>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  expect(MountedNavBar.find('NavBarTrigger').exists()).toBe(true);
  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
});

test('renders navTriggerLabel properly', () => {
  const MountedNavBar = mount(
    <NavBar collapsed navTriggerLabel="I am a label">
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  expect(MountedNavBar.find('NavBarTrigger').exists()).toBe(true);
  expect(
    MountedNavBar.find('NavBarTrigger')
      .find('button')
      .text()
  ).toEqual('I am a label');
  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
});

test('shows NavItems after clicking NavBarTrigger', () => {
  const MountedNavBar = mount(
    <NavBar collapsed>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  MountedNavBar.find('NavBarTrigger').simulate('click');
  MountedNavBar.update();
  expect(MountedNavBar.find('NavItem').exists()).toBe(true);
  expect(MountedNavBar.find('Scrim').prop('show')).toBe(true);
});

test('hides NavItems after clicking any of them', () => {
  const MountedNavBar = mount(
    <NavBar collapsed>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  MountedNavBar.find('NavBarTrigger').simulate('click');
  MountedNavBar.update();

  MountedNavBar.find('NavItem')
    .at(0)
    .simulate('click');
  MountedNavBar.update();

  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
  expect(MountedNavBar.find('Scrim').prop('show')).toBe(false);
});

test('hides NavItems when press escape key', async () => {
  const MountedNavBar = mount(
    <NavBar collapsed>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>,
    { attachTo: mountNode }
  );

  MountedNavBar.find('NavBarTrigger').simulate('click');
  MountedNavBar.update();

  MountedNavBar.find('NavBarTrigger').simulate('keydown', {
    key: 'Escape'
  });
  MountedNavBar.update();

  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
  expect(MountedNavBar.find('Scrim').prop('show')).toBe(false);
});

test('hides NavItems when focusing outside nav', async () => {
  const MountedNavBar = mount(
    <NavBar collapsed>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>,
    { attachTo: mountNode }
  );

  MountedNavBar.find('NavBarTrigger').simulate('click');
  MountedNavBar.update();

  act(() => {
    wrapperNode
      .querySelector('a')
      .dispatchEvent(new Event('focusin', { bubbles: true }));
  });

  MountedNavBar.update();

  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
  expect(MountedNavBar.find('Scrim').prop('show')).toBe(false);
});

test('does not hides NavItems when focusing inside nav', async () => {
  const MountedNavBar = mount(
    <NavBar collapsed>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>,
    { attachTo: mountNode }
  );

  MountedNavBar.find('NavBarTrigger').simulate('click');
  MountedNavBar.update();

  MountedNavBar.find('NavItem')
    .at(0)
    .simulate('focus');
  MountedNavBar.update();

  expect(MountedNavBar.find('NavItem').exists()).toBe(true);
  expect(MountedNavBar.find('Scrim').prop('show')).toBe(true);
});

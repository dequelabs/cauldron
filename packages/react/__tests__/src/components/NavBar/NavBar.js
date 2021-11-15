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

test('renders propId', () => {
  const MountedNavBar = mount(
    <NavBar propId="someid">
      <div />
    </NavBar>
  );

  expect(MountedNavBar.find('ul#someid').exists()).toBe(true);
});

test('renders NavBar trigger button when collapsed prop is true', () => {
  const MountedNavBar = mount(
    <NavBar collapsed>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  expect(MountedNavBar.find('.NavBar__trigger').exists()).toBe(true);
  expect(MountedNavBar.find('.NavBar__trigger--active').exists()).toBe(false);
  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
  expect(MountedNavBar.find('button').prop('aria-expanded')).toBe(false);
  expect(MountedNavBar.find('Icon').prop('type')).toEqual('hamburger-menu');
});

test('renders navTriggerLabel properly', () => {
  const MountedNavBar = mount(
    <NavBar collapsed navTriggerLabel="I am a label">
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  expect(MountedNavBar.find('.NavBar__trigger').exists()).toBe(true);
  expect(
    MountedNavBar.find('.NavBar__trigger')
      .find('button')
      .text()
  ).toEqual('I am a label');
  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
});

test('renders aria-controls prop on trigger button', () => {
  const MountedTrigger = mount(
    <NavBar collapsed propId="someid">
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );
  expect(
    MountedTrigger.find('button.NavBar__trigger').prop('aria-controls')
  ).toEqual('someid');
});

test('shows NavItems after clicking NavBar trigger button', () => {
  const MountedNavBar = mount(
    <NavBar collapsed>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  MountedNavBar.find('.NavBar__trigger').simulate('click');
  MountedNavBar.update();
  expect(MountedNavBar.find('NavItem').exists()).toBe(true);
  expect(MountedNavBar.find('.NavBar__trigger--active').exists()).toBe(true);
  expect(
    MountedNavBar.find('button.NavBar__trigger').prop('aria-expanded')
  ).toBe(true);
  expect(MountedNavBar.find('Icon').prop('type')).toEqual('close');
});

test('hides NavItems after pressing escape key', () => {
  const MountedNavBar = mount(
    <NavBar collapsed>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  MountedNavBar.find('.NavBar__trigger').simulate('click');
  MountedNavBar.update();

  MountedNavBar.find('ul').simulate('keydown', { key: 'Escape' });
  MountedNavBar.update();

  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
});

test('does not hide NavItems after pressing other keys', () => {
  const MountedNavBar = mount(
    <NavBar collapsed>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  MountedNavBar.find('.NavBar__trigger').simulate('click');
  MountedNavBar.update();

  MountedNavBar.find('ul').simulate('keydown', { key: 'Home' });
  MountedNavBar.update();

  expect(MountedNavBar.find('NavItem').exists()).toBe(true);
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

  MountedNavBar.find('.NavBar__trigger').simulate('click');
  MountedNavBar.update();

  act(() => {
    wrapperNode
      .querySelector('a')
      .dispatchEvent(new Event('focusin', { bubbles: true }));
  });

  MountedNavBar.update();

  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
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

  MountedNavBar.find('.NavBar__trigger').simulate('click');
  MountedNavBar.update();

  MountedNavBar.find('NavItem')
    .at(0)
    .simulate('focus');
  MountedNavBar.update();

  expect(MountedNavBar.find('NavItem').exists()).toBe(true);
});

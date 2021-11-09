import React from 'react';
import { mount } from 'enzyme';
import { NavBarTrigger } from 'src/components/NavBar';

const handleTriggerClick = jest.fn();
const handleKeyDown = jest.fn();

test('mounts without error', () => {
  expect(() =>
    mount(
      <NavBarTrigger
        show={true}
        handleTriggerClick={() => {}}
        handleKeyDown={() => {}}
      >
        <div />
      </NavBarTrigger>
    )
  ).not.toThrow();
});

test('renders children', () => {
  const MountedTrigger = mount(
    <NavBarTrigger
      show={true}
      handleTriggerClick={() => {}}
      handleKeyDown={() => {}}
    >
      <p>I am a child</p>
    </NavBarTrigger>
  );

  expect(MountedTrigger.find('p')).toHaveLength(1);
  expect(MountedTrigger.find('p').text()).toEqual('I am a child');
});

test('renders classNames prop', () => {
  const MountedTrigger = mount(
    <NavBarTrigger
      show={true}
      handleTriggerClick={() => {}}
      handleKeyDown={() => {}}
      className="find--me"
    >
      <div />
    </NavBarTrigger>
  );
  expect(MountedTrigger.find('.find--me').exists()).toBe(true);
});

test('renders properly when show is true', () => {
  const MountedTrigger = mount(
    <NavBarTrigger
      show={true}
      handleTriggerClick={() => {}}
      handleKeyDown={() => {}}
    >
      <div />
    </NavBarTrigger>
  );

  expect(MountedTrigger.find('.NavBar__menu-trigger--active').exists()).toBe(
    true
  );
  expect(MountedTrigger.find('button').prop('aria-expanded')).toBe(true);
  expect(MountedTrigger.find('Icon').prop('type')).toEqual('close');
});

test('renders properly when show is false', () => {
  const MountedTrigger = mount(
    <NavBarTrigger
      show={false}
      handleTriggerClick={() => {}}
      handleKeyDown={() => {}}
    >
      <div />
    </NavBarTrigger>
  );

  expect(MountedTrigger.find('.NavBar__menu-trigger--active').exists()).toBe(
    false
  );
  expect(MountedTrigger.find('button').prop('aria-expanded')).toBe(false);
  expect(MountedTrigger.find('Icon').prop('type')).toEqual('hamburger-menu');
});

test('evokes handleTriggerClick when clicking the button', () => {
  const MountedTrigger = mount(
    <NavBarTrigger
      show={true}
      handleTriggerClick={handleTriggerClick}
      handleKeyDown={() => {}}
    >
      <div />
    </NavBarTrigger>
  );

  MountedTrigger.find('button').simulate('click');
  MountedTrigger.update();
  expect(handleTriggerClick).toBeCalled();
});

test('evokes handleKeyDown when pressing any key', () => {
  const MountedTrigger = mount(
    <NavBarTrigger
      show={true}
      handleTriggerClick={() => {}}
      handleKeyDown={handleKeyDown}
    >
      <div />
    </NavBarTrigger>
  );

  MountedTrigger.find('button').simulate('keydown', { key: 'Escape' });
  MountedTrigger.update();
  expect(handleKeyDown).toBeCalled();
});

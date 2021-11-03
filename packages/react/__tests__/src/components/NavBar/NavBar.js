import React from 'react';
import { mount } from 'enzyme';
import NavBar, { NavItem } from 'src/components/NavBar';
import { isNarrow } from '../../../../src/utils/viewport';
import { act } from 'react-dom/test-utils';

const update = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();
  });
};

jest.mock('../../../../src/utils/viewport', () => ({
  isNarrow: jest.fn()
}));

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

test('renders NavBarTrigger when viewport is narrow', () => {
  isNarrow.mockImplementation(() => true);

  const MountedNavBar = mount(
    <NavBar>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  expect(MountedNavBar.find('NavBarTrigger').exists()).toBe(true);
  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
});

test('renders navTriggerChildren properly', () => {
  isNarrow.mockImplementation(() => true);

  const MountedNavBar = mount(
    <NavBar navTriggerChildren={<p>I am a child</p>}>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  expect(MountedNavBar.find('NavBarTrigger').exists()).toBe(true);
  expect(
    MountedNavBar.find('NavBarTrigger')
      .find('p')
      .text()
  ).toEqual('I am a child');
  expect(MountedNavBar.find('NavItem').exists()).toBe(false);
});

test('shows NavItems after clicking NavBarTrigger', async () => {
  isNarrow.mockImplementation(() => true);

  const MountedNavBar = mount(
    <NavBar>
      <NavItem>
        <p>first item</p>
      </NavItem>
    </NavBar>
  );

  MountedNavBar.find('NavBarTrigger').simulate('click');
  await update(MountedNavBar);
  expect(MountedNavBar.find('NavItem').exists()).toBe(true);
  console.log(MountedNavBar.find('NavItem').debug());
  // expect(MountedNavBar.find('Scrim').prop('show')).toBe(true);
});

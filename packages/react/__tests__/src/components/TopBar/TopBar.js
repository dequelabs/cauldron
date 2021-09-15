import React from 'react';
import { mount, shallow } from 'enzyme';
import TopBar from 'src/components/TopBar';
import MenuBar from 'src/components/MenuBar';
import { TopBarItem } from 'src/';
import axe from '../../../axe';
import { ThemeProvider } from '../../../../lib';
import sinon from 'sinon';

let observe, disconnect, trigger;

global.MutationObserver = class MutationObserver {
  constructor(handler) {
    this.observe = sinon.spy();
    this.disconnect = sinon.spy();
    // add a trigger method so we can simulate a mutation
    this.trigger = handler;

    observe = this.observe;
    disconnect = this.disconnect;
    trigger = this.trigger;
  }
};

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

test('should return no axe violations with dark theme', async () => {
  const topbar = mount(
    <ThemeProvider initialTheme="dark">
      <TopBar>
        <div>LOGO</div>
        <MenuBar>
          <TopBarItem>1</TopBarItem>
          <TopBarItem>2</TopBarItem>
          <TopBarItem>3</TopBarItem>
        </MenuBar>
      </TopBar>
    </ThemeProvider>
  );
  expect(await axe(topbar.html())).toHaveNoViolations();
});

test('should return no axe violations in light mode', async () => {
  const topbar = mount(
    <ThemeProvider initialTheme="light">
      <TopBar>
        <div>LOGO</div>
        <MenuBar>
          <TopBarItem>1</TopBarItem>
          <TopBarItem>2</TopBarItem>
          <TopBarItem>3</TopBarItem>
        </MenuBar>
      </TopBar>
    </ThemeProvider>
  );
  expect(await axe(topbar.html())).toHaveNoViolations();
});

import React from 'react';
import { mount } from 'enzyme';
import Workspace from '../../../../src/components/Workspace';

test('manages "Page--no-sidebar" class on body based on noSideBar prop', () => {
  const workspace = mount(<Workspace noSideBar>hi</Workspace>);
  expect(document.body.classList.contains('Page--no-sidebar')).toBeTruthy();
  workspace.setProps({ noSideBar: false });
  expect(document.body.classList.contains('Page--no-sidebar')).toBeFalsy();
  workspace.setProps({ noSideBar: true });
  expect(document.body.classList.contains('Page--no-sidebar')).toBeTruthy();
});

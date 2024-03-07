import React from 'react';
import { render } from '@testing-library/react';
import Workspace from './';

test('should add "Page--no-sidebar" class to body when noSideBar prop is true', () => {
  const { getByText } = render(<Workspace noSideBar>hi</Workspace>);
  const body = getByText('hi').closest('body');

  expect(body).toHaveClass('Page--no-sidebar');
});

test('should remove "Page--no-sidebar" class from body when noSideBar prop is set to false', () => {
  const { getByText } = render(<Workspace noSideBar={false}>hi</Workspace>);
  const body = getByText('hi').closest('body');

  expect(body).not.toHaveClass('Page--no-sidebar');
});

test('should add "Page--no-sidebar" class back to body when noSideBar prop is set to true again', () => {
  const { getByText } = render(<Workspace noSideBar>hi</Workspace>);
  const body = getByText('hi').closest('body');

  render(<Workspace noSideBar={false}>hi</Workspace>);
  expect(body).not.toHaveClass('Page--no-sidebar');

  render(<Workspace noSideBar>hi</Workspace>);
  expect(body).toHaveClass('Page--no-sidebar');
});

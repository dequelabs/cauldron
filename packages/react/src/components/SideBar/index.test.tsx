import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axe from '../../axe';
import SideBar, { SideBarItem } from '../SideBar';
import * as viewportUtils from '../../utils/viewport';
import userEvent from '@testing-library/user-event';
import { SideBarProps } from './SideBar';

const user = userEvent.setup();
const noop = jest.fn();
let wrapperNode: HTMLDivElement | null;

beforeEach(() => {
  wrapperNode = document.createElement('div');
  wrapperNode.innerHTML = `
    <a href="#foo" data-testid="link">Click Me!</a>
  `;
  document.body.appendChild(wrapperNode);
});

afterEach(() => {
  document.body.innerHTML = '';
  wrapperNode = null;
});

const renderWrapper = (props?: Partial<Omit<SideBarProps, 'children'>>) => {
  const { onDismiss = noop, show = false } = props || {};
  return render(
    <SideBar onDismiss={onDismiss} show={show}>
      <SideBarItem>a</SideBarItem>
      <SideBarItem>b</SideBarItem>
      <SideBarItem>c</SideBarItem>
    </SideBar>
  );
};

test('passes navProps to nav', async () => {
  const { rerender } = renderWrapper();

  rerender(
    <SideBar onDismiss={noop} navProps={{ 'aria-label': 'Side Bar' }}>
      <SideBarItem>a</SideBarItem>
      <SideBarItem>b</SideBarItem>
      <SideBarItem>c</SideBarItem>
    </SideBar>
  );

  const nav = await screen.findByRole('navigation');
  expect(nav).toHaveAttribute('aria-label', 'Side Bar');
});

test('properly handles viewport resize', () => {
  const isWideMock = jest.spyOn(viewportUtils, 'isWide').mockReturnValue(true);

  const { container } = renderWrapper();
  const sideBar = container.firstChild;
  expect(sideBar).toBeTruthy();

  fireEvent(document, new Event('resize'));

  expect(isWideMock).toBeCalled();
  jest.restoreAllMocks();
});

test('handles escape (calls onDismiss)', async () => {
  const onDismiss = jest.fn();
  const { container } = renderWrapper({ onDismiss });

  const sideBar = container.getElementsByClassName('SideBar')[0];
  expect(sideBar).toBeTruthy();

  fireEvent.keyDown(sideBar, { key: 'Escape', code: 'Escape', keyCode: 27 });
  expect(onDismiss).toBeCalled();
});

test('calls onDismiss when clicked outside', async () => {
  const onDismiss = jest.fn();
  jest.spyOn(viewportUtils, 'isWide').mockReturnValue(false);

  renderWrapper({ onDismiss, show: true });

  const item = await screen.findByText('a');
  item.focus();

  const outsideLink = await screen.findByTestId('link');

  await user.click(outsideLink);
  expect(onDismiss).toBeCalled();
  jest.restoreAllMocks();
});

test('animates / toggles display given a show prop change', async () => {
  const { rerender } = renderWrapper();

  const nav = await screen.findByRole('navigation');
  const ul = nav.querySelector('ul');

  expect(ul).toHaveClass('SideBar');

  rerender(
    <SideBar onDismiss={noop} show={true}>
      <SideBarItem>a</SideBarItem>
      <SideBarItem>b</SideBarItem>
      <SideBarItem>c</SideBarItem>
    </SideBar>
  );

  await waitFor(() => {
    expect(ul).toHaveClass('SideBar--show');
    expect(ul).toHaveClass('SideBar--active');
  });

  rerender(
    <SideBar onDismiss={noop} show={false}>
      <SideBarItem>a</SideBarItem>
      <SideBarItem>b</SideBarItem>
      <SideBarItem>c</SideBarItem>
    </SideBar>
  );

  await waitFor(() => {
    expect(ul).not.toHaveClass('SideBar--active');
    expect(ul).toHaveClass('SideBar--show');
  });
});

test('should return no axe violations', async () => {
  const { container } = renderWrapper();

  expect(await axe(container)).toHaveNoViolations();
});

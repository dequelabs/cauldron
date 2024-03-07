import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClickOutsideListener from './';

let wrapperNode: HTMLDivElement | null;
let mountNode: HTMLElement | null;

beforeEach(() => {
  wrapperNode = document.createElement('div');
  wrapperNode.innerHTML = `
    <a href="#foo" data-testid="link">Click Me!</a>
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

test('should render children with the text when using ClickOutsideListener', () => {
  const children = <div>Hello World</div>;

  const { getByText } = render(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <ClickOutsideListener onClickOutside={() => {}}>
      {children}
    </ClickOutsideListener>
  );

  const renderedChild = getByText('Hello World');
  expect(renderedChild).toBeInTheDocument();
});

test('should call onClickOutside when clicked outside', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>
  );

  fireEvent.click(screen.getByRole('link', { name: 'Click Me!' }));
  expect(onClickOutside).toBeCalled();
});

test('should call onClickOutside with event', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>
  );

  const event = new MouseEvent('click', { bubbles: true });
  fireEvent(screen.getByTestId('link'), event);
  expect(onClickOutside).toHaveBeenCalledWith(event);
});

test('should call onClickOutside when touched outside', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>
  );

  const event = new TouchEvent('touchend', { bubbles: true });
  fireEvent(screen.getByTestId('link'), event);
  expect(onClickOutside).toHaveBeenCalledTimes(1);
});

test('should not call onClickOutside when clicked inside', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>Click me!</div>
    </ClickOutsideListener>
  );

  fireEvent.click(screen.getByText('Click me!'));
  expect(onClickOutside).not.toBeCalled();
});

test('should not call onClickOutside when touched inside', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div data-testid="test">Touch me!</div>
    </ClickOutsideListener>
  );

  const event = new TouchEvent('touchend');
  fireEvent(screen.getByTestId('test'), event);
  expect(onClickOutside).not.toBeCalled();
});

test('should allow mouseEvent to be changed', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener
      onClickOutside={onClickOutside}
      mouseEvent="mousedown"
    >
      <div>bar</div>
    </ClickOutsideListener>
  );

  const event = new MouseEvent('mousedown', { bubbles: true });
  fireEvent(screen.getByTestId('link'), event);
  expect(onClickOutside).toHaveBeenCalledWith(event);
});

test('should allow mouseEvent to be false', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside} mouseEvent={false}>
      <div>bar</div>
    </ClickOutsideListener>
  );

  const event = new MouseEvent('click', { bubbles: true });
  fireEvent(screen.getByTestId('link'), event);
  expect(onClickOutside).not.toBeCalled();
});

test('should allow touchEvent to be changed', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener
      onClickOutside={onClickOutside}
      touchEvent="touchstart"
    >
      <div>div</div>
    </ClickOutsideListener>
  );

  const event = new TouchEvent('touchstart', { bubbles: true });
  fireEvent(screen.getByTestId('link'), event);
  expect(onClickOutside).toBeCalled();
});

test('should allow touchEvent to be false', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside} touchEvent={false}>
      <div>div</div>
    </ClickOutsideListener>
  );

  const event = new TouchEvent('touchend', { bubbles: true });
  fireEvent(screen.getByTestId('link'), event);
  expect(onClickOutside).not.toBeCalled();
});

test('should remove event listeners when props change', () => {
  const onClickOutside = jest.fn();

  const { rerender } = render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>
  );

  fireEvent.click(screen.getByTestId('link'));
  expect(onClickOutside).toHaveBeenCalledTimes(1);

  rerender(
    <ClickOutsideListener onClickOutside={onClickOutside} mouseEvent={false}>
      <div>bar</div>
    </ClickOutsideListener>
  );

  fireEvent.click(screen.getByTestId('link'));
  expect(onClickOutside).toHaveBeenCalledTimes(1);
});

test('should not remove event listeners when event props do not change', () => {
  const removeEventListeners = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onClickOutside = () => {};

  const { getByTestId } = render(
    <ClickOutsideListener onClickOutside={onClickOutside} mouseEvent="click">
      <div>bar</div>
    </ClickOutsideListener>
  );

  fireEvent.click(getByTestId('link'));
  expect(removeEventListeners).not.toBeCalled();
});

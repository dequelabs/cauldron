import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import ClickOutsideListener from './';

let wrapperNode: HTMLDivElement | null;
let mountNode: HTMLElement | null;

beforeEach(() => {
  wrapperNode = document.createElement('div');
  wrapperNode.innerHTML = `
    <a href="#foo" data-testid="link">Click Me!</a>
    <div id="target"></div>
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
  const onClickOutside = jest.fn();
  const children = <div>Hello World</div>;

  const { getByText } = render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      {children}
    </ClickOutsideListener>
  );

  const renderedChild = getByText('Hello World');
  expect(renderedChild).toBeInTheDocument();
});

test('should call onClickOutside when clicked outside', async () => {
  const onClickOutside = jest.fn();
  const user = userEvent.setup();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
  );

  await user.click(screen.getByRole('link', { name: 'Click Me!' }));
  expect(onClickOutside).toBeCalled();
});

test('should call onClickOutside with event', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
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
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
  );

  const event = new TouchEvent('touchend', { bubbles: true });
  fireEvent(screen.getByTestId('link'), event);
  expect(onClickOutside).toHaveBeenCalledTimes(1);
});

test('should not call onClickOutside when clicked inside', async () => {
  const onClickOutside = jest.fn();
  const user = userEvent.setup();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>Click me!</div>
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
  );

  await user.click(screen.getByText('Click me!'));
  expect(onClickOutside).not.toBeCalled();
});

test('should not call onClickOutside when clicked inside target element', async () => {
  const onClickOutside = jest.fn();
  const user = userEvent.setup();
  const target = document.getElementById('target') as HTMLElement;

  render(
    <ClickOutsideListener
      onClickOutside={onClickOutside}
      mouseEvent="click"
      target={target}
    >
      <div>Inside!</div>
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
  );

  await user.click(target);
  expect(onClickOutside).not.toHaveBeenCalled();
});

test('should not call onClickOutside when touched inside', () => {
  const onClickOutside = jest.fn();

  render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div data-testid="test">Touch me!</div>
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
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
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
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
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
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
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
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
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
  );

  const event = new TouchEvent('touchend', { bubbles: true });
  fireEvent(screen.getByTestId('link'), event);
  expect(onClickOutside).not.toBeCalled();
});

test('should remove event listeners when props change', async () => {
  const onClickOutside = jest.fn();
  const user = userEvent.setup();

  const { rerender } = render(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
  );

  await user.click(screen.getByTestId('link'));
  expect(onClickOutside).toHaveBeenCalledTimes(1);

  rerender(
    <ClickOutsideListener onClickOutside={onClickOutside} mouseEvent={false}>
      <div>bar</div>
    </ClickOutsideListener>
  );

  await user.click(screen.getByTestId('link'));
  expect(onClickOutside).toHaveBeenCalledTimes(1);
});

test('should not remove event listeners when event props do not change', () => {
  const removeEventListeners = jest.fn();
  const onClickOutside = jest.fn();

  const { getByTestId } = render(
    <ClickOutsideListener onClickOutside={onClickOutside} mouseEvent="click">
      <div>bar</div>
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
  );

  fireEvent.click(getByTestId('link'));
  expect(removeEventListeners).not.toBeCalled();
});

test('should allow for HTMLElement target', async () => {
  const user = userEvent.setup();
  const onClickOutside = jest.fn();
  const target = document.getElementById('target') as HTMLElement;

  const { getByTestId } = render(
    <ClickOutsideListener
      onClickOutside={onClickOutside}
      mouseEvent="click"
      target={target}
    >
      <>
        <div data-testid="child">bar</div>
      </>
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
  );

  await user.click(getByTestId('link'));
  expect(onClickOutside).toHaveBeenCalledTimes(1);
});

test('should allow for ref target', async () => {
  const user = userEvent.setup();
  const onClickOutside = jest.fn();
  const refTarget =
    React.createRef<HTMLElement>() as React.MutableRefObject<HTMLElement | null>;
  refTarget.current = document.getElementById('target');

  const { getByTestId } = render(
    <ClickOutsideListener
      onClickOutside={onClickOutside}
      mouseEvent="click"
      target={refTarget}
    >
      <>
        <div data-testid="child">bar</div>
      </>
    </ClickOutsideListener>,
    {
      container: mountNode as HTMLElement
    }
  );

  await user.click(getByTestId('link'));
  expect(onClickOutside).toHaveBeenCalledTimes(1);
});

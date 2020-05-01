import React from 'react';
import { mount } from 'enzyme';
import ClickOutsideListener from 'src/components/ClickOutsideListener';

const noop = () => {};

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

test('renders children', () => {
  const children = <div>Hello World</div>;
  const wrapper = mount(
    <ClickOutsideListener onClickOutside={noop}>
      <div>Hello World</div>
    </ClickOutsideListener>
  );

  expect(wrapper.contains(children)).toBe(true);
});

test('should call `onClickOutside` when clicked outside', () => {
  const onClickOutside = jest.fn();
  mount(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>,
    { attachTo: mountNode }
  );

  wrapperNode
    .querySelector('a')
    .dispatchEvent(new Event('click', { bubbles: true }));

  expect(onClickOutside).toBeCalled();
});

test('should not call `onClickOutside` when clicked inside', () => {
  const onClickOutside = jest.fn();
  const wrapper = mount(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div data-test>Click me!</div>
    </ClickOutsideListener>
  );

  wrapper.find('[data-test]').simulate('click');

  expect(onClickOutside).not.toBeCalled();
});

test('should call `onClickOutside` with event', () => {
  const onClickOutside = jest.fn();
  mount(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>,
    { attachTo: mountNode }
  );

  const testNode = wrapperNode.querySelector('[data-test]');
  const event = new Event('click', { bubbles: true });
  testNode.dispatchEvent(event);

  expect(onClickOutside).toBeCalledWith(event);
});

test('should allow `mouseEvent` to be changed', () => {
  const onClickOutside = jest.fn();
  mount(
    <ClickOutsideListener
      onClickOutside={onClickOutside}
      mouseEvent="mousedown"
    >
      <div>bar</div>
    </ClickOutsideListener>,
    { attachTo: mountNode }
  );

  wrapperNode
    .querySelector('[data-test]')
    .dispatchEvent(new Event('mousedown', { bubbles: true }));

  expect(onClickOutside).toBeCalled();
});

test('should allow `mouseEvent` to be false', () => {
  const onClickOutside = jest.fn();
  mount(
    <ClickOutsideListener onClickOutside={onClickOutside} mouseEvent={false}>
      <div>bar</div>
    </ClickOutsideListener>,
    { attachTo: mountNode }
  );

  wrapperNode
    .querySelector('[data-test]')
    .dispatchEvent(new Event('click', { bubbles: true }));

  expect(onClickOutside).not.toBeCalled();
});

test('should call `onClickOutside` when touched outside', () => {
  const onClickOutside = jest.fn();
  mount(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>,
    { attachTo: mountNode }
  );

  wrapperNode
    .querySelector('[data-test]')
    .dispatchEvent(new Event('touchend', { bubbles: true }));

  expect(onClickOutside).toHaveBeenCalledTimes(1);
});

test('should not call `onClickOutside` when touched inside', () => {
  const onClickOutside = jest.fn();
  const wrapper = mount(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div data-test>Touch me!</div>
    </ClickOutsideListener>
  );

  wrapper.find('[data-test]').simulate('touchend');

  expect(onClickOutside).not.toBeCalled();
});

test('should allow `touchEvent` to be changed', () => {
  const onClickOutside = jest.fn();
  mount(
    <ClickOutsideListener
      onClickOutside={onClickOutside}
      touchEvent="touchstart"
    >
      <div>bar</div>
    </ClickOutsideListener>,
    { attachTo: mountNode }
  );

  wrapperNode
    .querySelector('[data-test]')
    .dispatchEvent(new Event('touchstart', { bubbles: true }));

  expect(onClickOutside).toBeCalled();
});

test('should allow `touchEvent` to be false', () => {
  const onClickOutside = jest.fn();
  mount(
    <ClickOutsideListener onClickOutside={onClickOutside} touchEvent={false}>
      <div>bar</div>
    </ClickOutsideListener>,
    { attachTo: mountNode }
  );

  wrapperNode
    .querySelector('[data-test]')
    .dispatchEvent(new Event('touchend', { bubbles: true }));

  expect(onClickOutside).not.toBeCalled();
});

test('should remove event listeners when props change', () => {
  const onClickOutside = jest.fn();
  const wrapper = mount(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>,
    { attachTo: mountNode }
  );

  wrapper.setProps({ mouseEvent: false });
  wrapperNode
    .querySelector('[data-test]')
    .dispatchEvent(new Event('click'), { bubbles: true });

  expect(onClickOutside).not.toBeCalled();
});

test('should not remove event listeners when event props do not change', () => {
  const removeEventListeners = jest.fn();
  const onClickOutside = () => {};
  const wrapper = mount(
    <ClickOutsideListener onClickOutside={noop} mouseEvent="click">
      <div>bar</div>
    </ClickOutsideListener>
  );
  wrapper.instance().removeEventListeners = removeEventListeners;
  wrapper.setProps({ onClickOutside });

  expect(removeEventListeners).not.toBeCalled();
});

test('should not call `onClickOutside` when event is prevented', () => {
  const onClickOutside = jest.fn();
  mount(
    <ClickOutsideListener onClickOutside={onClickOutside}>
      <div>bar</div>
    </ClickOutsideListener>,
    { attachTo: mountNode }
  );

  document.body.addEventListener('click', event => event.preventDefault());

  const testNode = wrapperNode.querySelector('[data-test]');
  testNode.dispatchEvent(
    new Event('click', { bubbles: true, cancelable: true })
  );

  expect(onClickOutside).not.toBeCalled();
});

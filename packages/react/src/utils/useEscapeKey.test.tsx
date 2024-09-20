import React from 'react';
import { render, fireEvent, createEvent } from '@testing-library/react';
import useEscapeKey from './useEscapeKey';

const renderHook = (hookFn: () => void) => {
  const RenderHook = () => {
    hookFn();
    return null;
  };

  render(<RenderHook />);
};

afterEach(() => {
  jest.restoreAllMocks();
});

it('should listen to event in bubble phase', () => {
  const callback = jest.fn();
  const addEventListener = jest.spyOn(document.body, 'addEventListener');
  renderHook(() =>
    useEscapeKey({
      callback,
      capture: false
    })
  );

  expect(addEventListener.mock.lastCall?.[2]).toEqual(false);
});

it('should call callback with escape', async () => {
  const callback = jest.fn();
  renderHook(() =>
    useEscapeKey({
      callback
    })
  );

  expect(callback).not.toBeCalled();
  await fireEvent.keyUp(document.body, { key: 'Escape' });
  expect(callback).toBeCalled();
});

it('should call callback with esc', async () => {
  const callback = jest.fn();
  renderHook(() =>
    useEscapeKey({
      callback
    })
  );

  expect(callback).not.toBeCalled();
  await fireEvent.keyUp(document.body, { key: 'Esc' });
  expect(callback).toBeCalled();
});

it('should call callback with keyCode', async () => {
  const callback = jest.fn();
  renderHook(() =>
    useEscapeKey({
      callback
    })
  );

  expect(callback).not.toBeCalled();
  await fireEvent.keyUp(document.body, { keyCode: 27 });
  expect(callback).toBeCalled();
});

it('should listen to keydown event', async () => {
  const callback = jest.fn();
  renderHook(() =>
    useEscapeKey({
      callback,
      event: 'keydown'
    })
  );

  expect(callback).not.toBeCalled();
  await fireEvent.keyDown(document.body, { key: 'Escape' });
  expect(callback).toBeCalled();
});

it('should listen to keypress event', async () => {
  const callback = jest.fn();
  renderHook(() =>
    useEscapeKey({
      callback,
      event: 'keypress'
    })
  );

  expect(callback).not.toBeCalled();
  await fireEvent.keyPress(document.body, { key: 'Escape' });
  expect(callback).toBeCalled();
});

it('should listen to keypress event', async () => {
  const callback = jest.fn();
  renderHook(() =>
    useEscapeKey({
      callback,
      event: 'keyup'
    })
  );

  expect(callback).not.toBeCalled();
  await fireEvent.keyUp(document.body, { key: 'Escape' });
  expect(callback).toBeCalled();
});

it('should listen to target', async () => {
  const target = document.createElement('div');
  const callback = jest.fn();
  renderHook(() =>
    useEscapeKey({
      callback,
      target
    })
  );

  expect(callback).not.toBeCalled();
  await fireEvent.keyUp(target, { key: 'Escape' });
  expect(callback).toBeCalled();
});

it('should use capture', () => {
  const callback = jest.fn();
  const addEventListener = jest.spyOn(document.body, 'addEventListener');
  renderHook(() =>
    useEscapeKey({
      callback,
      capture: true
    })
  );

  expect(addEventListener.mock.lastCall?.[2]).toEqual(true);
});

// TODO: fix this test
it.skip('should check for default prevented', async () => {
  const callback = jest.fn();
  renderHook(() =>
    useEscapeKey({
      callback,
      defaultPrevented: true
    })
  );

  const fireKeyUpEvent = (preventDefault: boolean) => {
    const event = createEvent.keyUp(document.body, { key: 'Escape' });
    // rtl doesn't let us mock preventDefault
    // see: https://github.com/testing-library/react-testing-library/issues/572
    // @ts-expect-error not mocking function but
    event.preventDefault = preventDefault;
    fireEvent(document.body, event);
  };

  await fireEvent.keyUp(document.body, {
    key: 'Escape',
    defaultPrevented: true
  });
  // fireKeyUpEvent(true)
  expect(callback).not.toBeCalled();
  // fireKeyUpEvent(false)
  await fireEvent.keyUp(document.body, { key: 'Escape' });
  expect(callback).toBeCalled();
});

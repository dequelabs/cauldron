import { renderHook } from '@testing-library/react';
import handleEscapeKeyDown, {
  withEscapeKeyDown,
  useEscapeKeyDown
} from './handleEscapeKeyDown';

const keyDown = (init: KeyboardEventInit & { keyCode?: number }) =>
  new KeyboardEvent('keydown', { cancelable: true, ...init });

test.each([
  ['key Escape', { key: 'Escape' }],
  ['key Esc', { key: 'Esc' }],
  ['keyCode 27', { keyCode: 27 }]
])('closes and marks the event handled on %s', (_name, init) => {
  const close = jest.fn();
  const event = keyDown(init);

  expect(handleEscapeKeyDown(event, close)).toBe(true);
  expect(close).toHaveBeenCalledTimes(1);
  expect(event.defaultPrevented).toBe(true);
});

test('ignores other keys', () => {
  const close = jest.fn();
  const event = keyDown({ key: 'Enter' });

  expect(handleEscapeKeyDown(event, close)).toBe(false);
  expect(close).not.toHaveBeenCalled();
  expect(event.defaultPrevented).toBe(false);
});

test('ignores an Escape that something inside already handled', () => {
  const close = jest.fn();
  const event = keyDown({ key: 'Escape' });
  event.preventDefault();

  expect(handleEscapeKeyDown(event, close)).toBe(false);
  expect(close).not.toHaveBeenCalled();
});

test('ignores an Escape while an input method editor is composing', () => {
  const close = jest.fn();
  const event = keyDown({ key: 'Escape', isComposing: true });

  expect(handleEscapeKeyDown(event, close)).toBe(false);
  expect(close).not.toHaveBeenCalled();
  expect(event.defaultPrevented).toBe(false);
});

test('accepts React synthetic events', () => {
  const close = jest.fn();
  const nativeEvent = keyDown({ key: 'Escape' });
  const syntheticEvent = {
    key: 'Escape',
    nativeEvent,
    preventDefault: () => nativeEvent.preventDefault()
  } as unknown as React.KeyboardEvent;

  expect(handleEscapeKeyDown(syntheticEvent, close)).toBe(true);
  expect(nativeEvent.defaultPrevented).toBe(true);
});

describe('withEscapeKeyDown', () => {
  const synthetic = (nativeEvent: KeyboardEvent) =>
    ({
      key: nativeEvent.key,
      nativeEvent,
      preventDefault: () => nativeEvent.preventDefault()
    }) as unknown as React.KeyboardEvent<HTMLElement>;

  test('runs the consumer handler first, which can claim Escape', () => {
    const close = jest.fn();
    const handler = withEscapeKeyDown<HTMLElement>(
      (event) => event.preventDefault(),
      close
    );

    handler(synthetic(keyDown({ key: 'Escape' })));
    expect(close).not.toHaveBeenCalled();
  });

  test('closes on Escape when close is given', () => {
    const close = jest.fn();
    withEscapeKeyDown<HTMLElement>(
      undefined,
      close
    )(synthetic(keyDown({ key: 'Escape' })));
    expect(close).toHaveBeenCalledTimes(1);
  });

  test('does nothing on Escape without close', () => {
    const onKeyDown = jest.fn();
    const event = keyDown({ key: 'Escape' });
    withEscapeKeyDown<HTMLElement>(onKeyDown, undefined)(synthetic(event));
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(false);
  });
});

describe('useEscapeKeyDown', () => {
  const pressEscape = (target: EventTarget) => {
    const event = keyDown({ key: 'Escape', bubbles: true });
    target.dispatchEvent(event);
    return event;
  };

  test('listens on the target while active', () => {
    const target = document.createElement('button');
    const onEscape = jest.fn();
    const { rerender } = renderHook(
      ({ active }) => useEscapeKeyDown({ target, active, onEscape }),
      { initialProps: { active: true } }
    );

    expect(pressEscape(target).defaultPrevented).toBe(true);
    expect(onEscape).toHaveBeenCalledTimes(1);

    rerender({ active: false });
    pressEscape(target);
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  test('resolves a ref target', () => {
    const target = { current: document.createElement('button') };
    const onEscape = jest.fn();
    renderHook(() => useEscapeKeyDown({ target, active: true, onEscape }));

    pressEscape(target.current);
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  test('calls the latest callback', () => {
    const target = document.createElement('button');
    const first = jest.fn();
    const second = jest.fn();
    const { rerender } = renderHook(
      ({ onEscape }) => useEscapeKeyDown({ target, active: true, onEscape }),
      { initialProps: { onEscape: first } }
    );

    rerender({ onEscape: second });
    pressEscape(target);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});

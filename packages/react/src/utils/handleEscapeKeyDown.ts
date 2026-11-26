import { useEffect, useRef } from 'react';
import type React from 'react';

type AnyKeyboardEvent = KeyboardEvent | React.KeyboardEvent;

const isEscapeKey = (event: AnyKeyboardEvent) =>
  event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27;

/**
 * Closes one layer per Escape press. Components handle Escape on `keydown`
 * from their own element, so the innermost layer sees it first as it
 * bubbles. An event that is already `defaultPrevented` was handled inside, and
 * a handled event is marked with `preventDefault()` so outer layers skip it.
 *
 * To keep a Cauldron container open, call `preventDefault()` on the Escape
 * `keydown` in your own control.
 *
 * @returns `true` when `close` was called
 */
export default function handleEscapeKeyDown(
  event: AnyKeyboardEvent,
  close: () => void
): boolean {
  const nativeEvent = 'nativeEvent' in event ? event.nativeEvent : event;

  if (
    !isEscapeKey(event) ||
    nativeEvent.defaultPrevented ||
    // the Escape belongs to an input method editor that is composing text
    nativeEvent.isComposing
  ) {
    return false;
  }

  event.preventDefault();
  close();
  return true;
}

/**
 * Builds an `onKeyDown` that runs the consumer's handler first, so it can
 * claim Escape, then closes on Escape when `close` is given.
 */
export function withEscapeKeyDown<E extends Element>(
  onKeyDown: React.KeyboardEventHandler<E> | undefined,
  close: (() => void) | undefined
): React.KeyboardEventHandler<E> {
  return (event) => {
    onKeyDown?.(event);
    if (close) {
      handleEscapeKeyDown(event, close);
    }
  };
}

/**
 * For the few places that cannot use a React `onKeyDown` on their own
 * element: listens for Escape `keydown` on `target` while `active`.
 */
export function useEscapeKeyDown({
  target,
  active,
  capture = false,
  onEscape
}: {
  target: EventTarget | React.RefObject<EventTarget | null> | null | undefined;
  active: boolean;
  capture?: boolean;
  onEscape: () => void;
}) {
  // the latest callback, so a new function each render does not re-subscribe
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    const element = target && 'current' in target ? target.current : target;
    if (!active || !element) {
      return;
    }

    const listener = (event: Event) =>
      handleEscapeKeyDown(event as KeyboardEvent, () => onEscapeRef.current());

    element.addEventListener('keydown', listener, capture);
    return () => element.removeEventListener('keydown', listener, capture);
  }, [active, target, capture]);
}

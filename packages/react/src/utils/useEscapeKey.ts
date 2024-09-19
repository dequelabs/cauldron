import { useEffect, type DependencyList } from 'react';

const isEscapeKey = (event: KeyboardEvent) =>
  event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27;

/**
 * When a component needs to implement an escape handler, such as in modal
 * dialogs, useEscapeKey will handle the events and call the provided callback
 * handler when an escape key event has been fired.
 *
 * @example
 * useEscapeKey(() => close())
 */
export default function useEscapeKey(
  options: {
    callback: (event: KeyboardEvent) => void;
    target?: HTMLElement;
    active?: boolean;
    event?: 'keydown' | 'keypress' | 'keyup';
    defaultPrevented?: boolean;
    capture?: boolean;
  },
  dependencies: DependencyList = []
) {
  const callback = options.callback;
  const event = options.event || 'keyup';
  const target = options.target || document.body;
  const active = typeof options.active === 'boolean' ? options.active : true;

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      if (
        isEscapeKey(event) && options.defaultPrevented
          ? !event.defaultPrevented
          : true
      ) {
        callback(event);
      }
    };

    if (active) {
      target.addEventListener(event, eventListener, options?.capture);
    }

    return () => {
      target.removeEventListener(event, eventListener, options?.capture);
    };
  }, [active, event, target, ...dependencies]);
}

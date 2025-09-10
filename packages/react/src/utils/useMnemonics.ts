import type { MutableRefObject, RefObject } from 'react';
import type { ElementOrRef } from '../types';
import { useRef, useEffect } from 'react';
import focusable from 'focusable';

type useMnemonicsOptions = {
  /**
   * The container element or ref to use for matching elements for mnemonics.
   * If not provided, the hook will return a ref that should be attached to a container.
   */
  elementOrRef?: ElementOrRef<HTMLElement>;

  /**
   * CSS selector to match for elements, defaults to focusable descendants.
   */
  matchingElementsSelector?: string;

  /**
   * Callback fired when a matching element is found via mnemonic keyboard entry.
   */
  onMatch: (element: HTMLElement) => void;

  /**
   * Whether mnemonic navigation is enabled. Defaults to true.
   */
  enabled?: boolean;
};

type useMnemonicsResults<T extends HTMLElement> = RefObject<T>;

/**
 * Get an element's accessible name by its aria-label or text content
 */
function getAccessibleLabel(element: Element): string {
  return (
    element.getAttribute('aria-label') || element.textContent?.trim() || ''
  );
}

/**
 * A hook that provides mnemonic navigation for keyboard users.
 *
 * Mnemonics allow users to quickly navigate to elements by typing the first
 * letter of the element's text content. Pressing the same letter repeatedly
 * cycles through all matching elements.
 */
export default function useMnemonics<T extends HTMLElement>({
  elementOrRef,
  matchingElementsSelector,
  onMatch,
  enabled = true
}: useMnemonicsOptions): useMnemonicsResults<T> {
  const containerRef = useRef<T>() as MutableRefObject<T>;
  const activeElement = useRef<HTMLElement | null>();

  useEffect(() => {
    if (elementOrRef instanceof HTMLElement) {
      containerRef.current = elementOrRef as T;
    } else if (!!elementOrRef && 'current' in elementOrRef) {
      containerRef.current = elementOrRef?.current as T;
    }
  }, [elementOrRef]);

  useEffect(() => {
    if (!enabled || !containerRef.current) {
      return;
    }

    const keyboardHandler = (event: KeyboardEvent) => {
      // Ignore keyboard events where a modifier key was pressed
      const hasModifier = event.ctrlKey || event.altKey || event.metaKey;
      if (hasModifier) {
        return;
      }

      // Ignore keyboard events where a non-alphanumeric character was pressed
      if (event.key.length !== 1 || !/[a-z\d]/i.test(event.key)) {
        return;
      }

      const container = containerRef.current;
      if (!container) {
        return;
      }

      // Prevent default behavior and stop propagation for mnemonic keys
      event.preventDefault();
      event.stopPropagation();

      const elements = Array.from(
        container.querySelectorAll(matchingElementsSelector ?? focusable)
      );
      const matchingElements = elements.filter(
        (element) =>
          getAccessibleLabel(element).toLowerCase()[0] ===
          event.key.toLowerCase()
      );

      if (!matchingElements.length) {
        activeElement.current = null;
        return;
      }

      const activeIndex = activeElement.current
        ? matchingElements.indexOf(activeElement.current)
        : -1;
      if (activeIndex === -1 || activeIndex === matchingElements.length - 1) {
        activeElement.current = matchingElements[0] as HTMLElement;
      } else {
        activeElement.current = matchingElements[
          activeIndex + 1
        ] as HTMLElement;
      }

      if (typeof onMatch === 'function') {
        onMatch(activeElement.current);
      }
    };

    const container = containerRef.current;
    container.addEventListener('keydown', keyboardHandler);

    return () => container.removeEventListener('keydown', keyboardHandler);
  }, [enabled, containerRef]);

  return containerRef;
}

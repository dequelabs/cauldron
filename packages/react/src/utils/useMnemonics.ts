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
    // We're explicitly ignoring that we _could_ use aria-labelledby here
    // because of the additional complexity that is needed in order to calculate
    // the accessible name of an aria-labelled by idref. We're reserving that behavior
    // for future implementation if it is determined to be needed.
    element.getAttribute('aria-label') || element.textContent?.trim() || ''
  );
}

/**
 * Gets the active element based on the root element passed in
 */
function getActiveElement(root: HTMLElement): HTMLElement | null {
  let activeElement: HTMLElement | null;

  if (
    document.activeElement === root &&
    root.hasAttribute('aria-activedescendant')
  ) {
    activeElement = document.getElementById(
      // Validating attribute above with "hasAttribute"
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      root.getAttribute('aria-activedescendant')!
    );
  } else {
    activeElement = document.activeElement as HTMLElement;
  }

  return root.contains(activeElement) ? activeElement : null;
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
      ) as HTMLElement[];

      if (!matchingElements.length) {
        return;
      }

      const currentActiveElement = getActiveElement(containerRef.current);
      let nextActiveElement: HTMLElement | null = null;

      if (currentActiveElement) {
        nextActiveElement = matchingElements.find(
          (element) =>
            // Find the next matching element that is _after_ the current active element
            // within the collection of identified elements
            !!(
              element.compareDocumentPosition(currentActiveElement) &
              Node.DOCUMENT_POSITION_PRECEDING
            )
        ) as HTMLElement;
      }

      if (typeof onMatch === 'function') {
        onMatch(nextActiveElement ?? matchingElements[0]);
      }
    };

    const container = containerRef.current;
    container.addEventListener('keydown', keyboardHandler);

    return () => container.removeEventListener('keydown', keyboardHandler);
  }, [enabled, containerRef, matchingElementsSelector, onMatch]);

  return containerRef;
}

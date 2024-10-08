import type { RefObject, MutableRefObject } from 'react';

/**
 * When an element can be passed as a value that is either an element or an
 * elementRef, this will resolve the property down to the resulting element
 */
export default function resolveElement<T extends Element = Element>(
  elementOrRef: T | RefObject<T> | MutableRefObject<T> | undefined
): T | null {
  if (elementOrRef instanceof Element) {
    return elementOrRef;
  }

  if (
    elementOrRef &&
    typeof elementOrRef === 'object' &&
    'current' in elementOrRef &&
    elementOrRef.current instanceof Element
  ) {
    return elementOrRef.current;
  }

  return null;
}

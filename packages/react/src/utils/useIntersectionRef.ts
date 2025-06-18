import type { MutableRefObject } from 'react';
import { useRef, useEffect } from 'react';

/**
 * When a component needs to track intersection via a ref, useIntersectionRef
 * will return a ref object containing the results from IntersectionObserver
 * for the current intersection entry.
 *
 * @example
 * const elementRef = useRef<HTMLElement>()
 * const intersectionRef = useIntersectionRef<HTMLElement>(elementRef)
 * return <span ref={elementRef}>...</span>
 */
export default function useIntersectionRef<T extends HTMLElement>(
  element: MutableRefObject<T> | null,
  intersectionObserverOptions: IntersectionObserverInit = {
    root: null,
    threshold: 1.0
  }
): MutableRefObject<IntersectionObserverEntry | null> {
  const intersectionRef = useRef<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    // istanbul ignore else
    if (
      'IntersectionObserver' in globalThis &&
      typeof IntersectionObserver === 'function'
    ) {
      if (typeof element === 'undefined' || element === null) {
        return;
      }

      if (!(element.current instanceof HTMLElement)) {
        console.warn(
          'A ref was provided to useIntersectionRef that was not an HTMLElement.'
        );
        return;
      }

      const handleIntersection: IntersectionObserverCallback = ([entry]) => {
        intersectionRef.current = entry;
      };

      const observer = new IntersectionObserver(
        handleIntersection,
        intersectionObserverOptions
      );

      observer.observe(element.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [element?.current]);

  return intersectionRef;
}

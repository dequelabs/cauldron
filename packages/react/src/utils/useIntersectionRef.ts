import type { MutableRefObject } from 'react';
import { useRef, useEffect } from 'react';
import type { ElementOrRef } from '../types';
import resolveElement from './resolveElement';

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
  elementOrRef: ElementOrRef<T>,
  intersectionObserverOptions: IntersectionObserverInit = {
    root: null,
    threshold: 1.0
  }
): MutableRefObject<IntersectionObserverEntry | null> {
  const intersectionRef = useRef<IntersectionObserverEntry | null>(null);

  const element = resolveElement(elementOrRef);

  useEffect(() => {
    // istanbul ignore else
    if (
      'IntersectionObserver' in globalThis &&
      typeof IntersectionObserver === 'function'
    ) {
      if (typeof element === 'undefined' || element === null) {
        return;
      }

      if (!(element instanceof HTMLElement)) {
        console.warn(
          'An element or ref was provided to useIntersectionRef that was not an HTMLElement.'
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

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }
  }, [element]);

  return intersectionRef;
}

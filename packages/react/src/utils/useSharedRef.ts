import { MutableRefObject, Ref, useRef, useEffect } from 'react';
import setRef from './setRef';

/**
 * When a component needs to track an internal ref on a component that has a
 * forwarded ref, useSharedRef will return a MutableRefObject<T> that will
 * correctly invoke the parent ref as well providing an internal ref.
 *
 * @example
 * React.forwardRef(function Component({ children }, ref) {
 *   const internalRef = useSharedRef<HTMLElement>(ref)
 *   if (internalRef.current) {
 *     // do something with the internal ref...
 *   }
 *   return (<div ref={internalRef}>...</div>)
 * })
 */
export default function useSharedRef<T>(ref: Ref<T>): MutableRefObject<T> {
  const internalRef = useRef<T>();
  useEffect(() => {
    setRef(ref, internalRef.current);
  }, [ref]);
  return internalRef as MutableRefObject<T>;
}

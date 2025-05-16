import React, { useRef, useEffect } from 'react';
import setRef from '../../utils/setRef';
import resolveElement from '../../utils/resolveElement';

export interface ClickOutsideListenerProps<
  T extends HTMLElement = HTMLElement
> {
  children?: React.ReactNode;
  onClickOutside: (e: MouseEvent | TouchEvent) => void;
  mouseEvent?: 'mousedown' | 'click' | 'mouseup' | false;
  touchEvent?: 'touchstart' | 'touchend' | false;
  target?: T | React.RefObject<T> | React.MutableRefObject<T>;
}

function ClickOutsideListener(
  {
    children,
    mouseEvent = 'click',
    touchEvent = 'touchend',
    target,
    onClickOutside = () => null
  }: ClickOutsideListenerProps,
  ref: React.ForwardedRef<HTMLElement>
): React.JSX.Element | null {
  const childElementRef = useRef<HTMLElement>();

  const handleEvent = (event: MouseEvent | TouchEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    const eventTarget = event.target as HTMLElement;
    const elementTarget = resolveElement(target);

    if (target && !elementTarget?.contains(eventTarget)) {
      onClickOutside(event);

      // If a target is passed in via a prop, we defer to utilizing that
      // target instead of a child element target
      return;
    }

    if (
      !target &&
      childElementRef.current &&
      !childElementRef.current.contains(eventTarget)
    ) {
      onClickOutside(event);
    }
  };

  const resolveRef = (node: HTMLElement) => {
    childElementRef.current = node;
    // Ref for this component should pass-through to the child node
    setRef(ref, node);
    // If child has its own ref, we want to update
    // its ref with the newly cloned node
    const { ref: childRef } = children as any;
    setRef(childRef, node);
  };

  useEffect(() => {
    typeof mouseEvent === 'string' &&
      document.addEventListener(mouseEvent, handleEvent, true);
    typeof touchEvent === 'string' &&
      document.addEventListener(touchEvent, handleEvent, true);

    return () => {
      typeof mouseEvent === 'string' &&
        document.removeEventListener(mouseEvent, handleEvent, true);
      typeof touchEvent === 'string' &&
        document.removeEventListener(touchEvent, handleEvent, true);
    };
  }, [mouseEvent, touchEvent]);

  return !children
    ? null
    : React.cloneElement(children as React.ReactElement, { ref: resolveRef });
}

ClickOutsideListener.displayName = 'ClickOutsideListener';

export default React.forwardRef(ClickOutsideListener);

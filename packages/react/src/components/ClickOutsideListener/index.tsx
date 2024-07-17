import React, { useRef, useEffect } from 'react';
import setRef from '../../utils/setRef';

export interface ClickOutsideListenerProps<
  T extends HTMLElement = HTMLElement
> {
  children?: React.ReactElement;
  onClickOutside: (e: MouseEvent | TouchEvent) => void;
  mouseEvent?: 'mousedown' | 'click' | 'mouseup' | false;
  touchEvent?: 'touchstart' | 'touchend' | false;
  target?: T;
}

function ClickOutsideListener(
  {
    children,
    mouseEvent = 'mouseup',
    touchEvent = 'touchend',
    target,
    onClickOutside = () => null
  }: ClickOutsideListenerProps,
  ref: React.ForwardedRef<HTMLElement>
): JSX.Element | null {
  const childElementRef = useRef<HTMLElement>();

  const handleEvent = (event: MouseEvent | TouchEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    const eventTarget = event.target as HTMLElement;
    if (
      (!!target && !target.contains(eventTarget)) ||
      (childElementRef.current &&
        !childElementRef.current.contains(eventTarget))
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
      document.addEventListener(mouseEvent, handleEvent);
    typeof touchEvent === 'string' &&
      document.addEventListener(touchEvent, handleEvent);

    return () => {
      typeof mouseEvent === 'string' &&
        document.removeEventListener(mouseEvent, handleEvent);
      typeof touchEvent === 'string' &&
        document.removeEventListener(touchEvent, handleEvent);
    };
  }, [mouseEvent, touchEvent]);

  return !children
    ? null
    : React.cloneElement(children as React.ReactElement, { ref: resolveRef });
}

ClickOutsideListener.displayName = 'ClickOutsideListener';

export default React.forwardRef(ClickOutsideListener);

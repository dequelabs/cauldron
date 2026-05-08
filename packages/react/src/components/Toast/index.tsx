import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import AriaIsolate from '../../utils/aria-isolate';
import { typeMap, tabIndexHandler } from './utils';
import useSharedRef from '../../utils/useSharedRef';
import useDidUpdate from '../../utils/use-did-update';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'confirmation' | 'caution' | 'error' | 'action-needed' | 'info';
  onDismiss?: () => void;
  dismissText?: string;
  toastRef?: React.Ref<HTMLDivElement>;
  focus?: boolean;
  show?: boolean;
  dismissible?: boolean;
  children: React.ReactNode;
}

/**
 * The cauldron toast notification component
 */
const Toast = ({
  type,
  children,
  onDismiss = () => {
    // noop
  },
  dismissText = 'Dismiss',
  toastRef,
  focus = true,
  show = false,
  dismissible = true,
  className,
  ...otherProps
}: ToastProps) => {
  const elRef = useSharedRef<HTMLDivElement>(toastRef ?? null);
  const isolatorRef = useRef<AriaIsolate | null>(null);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const [animationClass, setAnimationClass] = useState<string>(
    show ? 'FadeIn--flex' : 'is--hidden'
  );

  // Timeout because CSS display: none/block and opacity:
  // 0/1 properties cannot be toggled in the same tick
  // see: https://codepen.io/isnerms/pen/eyQaLP
  const scheduleNextTick = (fn: () => void) => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id);
      fn();
    });
    timeoutsRef.current.add(id);
  };

  const showToast = useCallback(() => {
    setAnimationClass('FadeIn--flex FadeIn');

    if (type === 'action-needed' && elRef.current) {
      const isolator = new AriaIsolate(elRef.current);
      tabIndexHandler(false, elRef.current);
      isolatorRef.current = isolator;
      isolator.activate();
    }

    if (elRef.current && !!focus) {
      elRef.current.focus();
    }
  }, [type, focus]);

  const dismissToast = useCallback(() => {
    if (!elRef.current) {
      return;
    }

    setAnimationClass('FadeIn--flex');

    scheduleNextTick(() => {
      if (type === 'action-needed') {
        tabIndexHandler(true, elRef.current);
        isolatorRef.current?.deactivate();
      }

      setAnimationClass('is--hidden');
      onDismiss();
    });
  }, [type, onDismiss]);

  useEffect(() => {
    if (show) {
      scheduleNextTick(showToast);
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current.clear();
      isolatorRef.current?.deactivate();
    };
  }, []);

  useDidUpdate(() => {
    if (show) {
      setAnimationClass('FadeIn--flex');
      scheduleNextTick(showToast);
    } else {
      dismissToast();
    }
  }, [show]);

  const scrim =
    type === 'action-needed' && show ? (
      <div className="Scrim--light Scrim--show Scrim--fade-in" />
    ) : null;

  const defaultProps: React.HTMLAttributes<HTMLDivElement> = {
    tabIndex: -1,
    className: classNames(
      'Toast',
      `Toast--${typeMap[type].className}`,
      animationClass,
      { 'Toast--non-dismissible': !dismissible },
      className
    )
  };

  if (!focus) {
    defaultProps.role = 'alert';
  }

  return (
    <>
      <div ref={elRef} {...defaultProps} {...otherProps}>
        <div className="Toast__message">
          <Icon type={typeMap[type].icon} />
          <div className="Toast__message-content">{children}</div>
        </div>
        {type !== 'action-needed' && dismissible && (
          <button
            type="button"
            className="Toast__dismiss"
            aria-label={dismissText}
            onClick={dismissToast}
          >
            <Icon type="close" />
          </button>
        )}
      </div>
      {scrim}
    </>
  );
};

Toast.displayName = 'Toast';

export default Toast;

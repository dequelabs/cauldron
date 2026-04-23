import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import AriaIsolate from '../../utils/aria-isolate';
import { typeMap, tabIndexHandler } from './utils';
import setRef from '../../utils/setRef';

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
  onDismiss,
  dismissText = 'Dismiss',
  toastRef,
  focus = true,
  show = false,
  dismissible = true,
  className,
  ...otherProps
}: ToastProps) => {
  const [animationClass, setAnimationClass] = useState(
    show ? 'FadeIn--flex' : 'is--hidden'
  );

  const elRef = useRef<HTMLDivElement | null>(null);
  const isolatorRef = useRef<AriaIsolate | undefined>(undefined);
  const isFirstRenderRef = useRef(true);

  // Keep refs to latest prop values to avoid stale closures in effects/callbacks
  const typeRef = useRef(type);
  const focusRef = useRef(focus);
  const onDismissRef = useRef(onDismiss);
  typeRef.current = type;
  focusRef.current = focus;
  onDismissRef.current = onDismiss;

  const showToast = () => {
    const el = elRef.current;
    setAnimationClass('FadeIn--flex FadeIn');

    if (typeRef.current === 'action-needed') {
      const newIsolator = new AriaIsolate(el as HTMLDivElement);
      tabIndexHandler(false, el);
      isolatorRef.current = newIsolator;
      newIsolator.activate();
    }

    if (el && focusRef.current) {
      el.focus();
    }
  };

  const dismissToast = () => {
    const el = elRef.current;
    if (!el) return;

    setAnimationClass('FadeIn--flex');

    // Timeout because CSS display: none/block and opacity:
    // 0/1 properties cannot be toggled in the same tick
    // see: https://codepen.io/isnerms/pen/eyQaLP
    setTimeout(() => {
      if (typeRef.current === 'action-needed') {
        tabIndexHandler(true, el);
        isolatorRef.current?.deactivate();
      }

      setAnimationClass('is--hidden');
      onDismissRef.current?.();
    });
  };

  // Mount effect: if initially shown, trigger the show animation
  useEffect(() => {
    if (show) {
      // Timeout because CSS display: none/block and opacity:
      // 0/1 properties cannot be toggled in the same tick
      // see: https://codepen.io/isnerms/pen/eyQaLP
      const id = setTimeout(showToast);
      return () => clearTimeout(id);
    }
  }, []);

  // Effect to handle `show` prop changes after mount
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (show) {
      setAnimationClass('FadeIn--flex');
      const id = setTimeout(showToast);
      return () => clearTimeout(id);
    } else {
      dismissToast();
    }
  }, [show]);

  // Cleanup: deactivate aria isolate on unmount
  useEffect(() => {
    return () => {
      isolatorRef.current?.deactivate();
    };
  }, []);

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
    <React.Fragment>
      <div
        ref={(el) => {
          elRef.current = el;
          setRef(toastRef, el);
        }}
        {...defaultProps}
        {...otherProps}
      >
        <div className="Toast__message">
          <Icon type={typeMap[type].icon} />
          <div className="Toast__message-content">{children}</div>
        </div>
        {type !== 'action-needed' && dismissible && (
          <button
            type="button"
            className={'Toast__dismiss'}
            aria-label={dismissText}
            onClick={dismissToast}
          >
            <Icon type="close" />
          </button>
        )}
      </div>
      {scrim}
    </React.Fragment>
  );
};

Toast.displayName = 'Toast';

export default Toast;

import React, {
  forwardRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef
} from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import classnames from 'classnames';
import Scrim from '../Scrim';
import ClickOutsideListener from '../ClickOutsideListener';
import useEscapeKey from '../../utils/useEscapeKey';
import useSharedRef from '../../utils/useSharedRef';
import focusableSelector from '../../utils/focusable-selector';
import resolveElement from '../../utils/resolveElement';
import AriaIsolate from '../../utils/aria-isolate';
import { isBrowser } from '../../utils/is-browser';

export interface DrawerProps<T extends HTMLElement = HTMLElement>
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  open?: boolean;
  behavior?: 'modal' | 'non-modal';
  focusOptions?: {
    initialFocus?: T | React.RefObject<T> | React.MutableRefObject<T>;
    returnFocus?: T | React.RefObject<T> | React.MutableRefObject<T>;
  };
  onClose?: () => void;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      children,
      className,
      position,
      open = false,
      behavior = 'modal',
      focusOptions = {},
      portal,
      onClose,
      style,
      ...props
    },
    ref
  ) => {
    const drawerRef = useSharedRef(ref);
    const openRef = useRef(!!open);
    const previousActiveElementRef = useRef<HTMLElement>(
      null
    ) as React.MutableRefObject<HTMLElement | null>;
    const { initialFocus: focusInitial, returnFocus: focusReturn } =
      focusOptions;
    const [isTransitioning, setIsTransitioning] = useState(!!open);
    const isModal = behavior === 'modal';

    const handleClose = useCallback(() => {
      // istanbul ignore next
      if (open && typeof onClose === 'function') {
        onClose();
      }
    }, [open, onClose]);

    useEffect(() => {
      // jsdom does not trigger transitionend event
      // istanbul ignore next
      const transitionEndHandler = () => setIsTransitioning(false);

      document.addEventListener('transitionend', transitionEndHandler);
      return () => {
        document.removeEventListener('transitionend', transitionEndHandler);
      };
    }, [setIsTransitioning]);

    useEffect(() => {
      if (openRef.current !== open) {
        setIsTransitioning(true);
      }

      openRef.current = open;
    }, [open, setIsTransitioning]);

    useEffect(() => {
      if (!isModal) {
        return;
      }

      const isolator = new AriaIsolate(drawerRef.current);
      if (open) {
        isolator.activate();
      } else {
        isolator.deactivate();
      }

      return () => {
        isolator.deactivate();
      };
    }, [isModal, open]);

    useLayoutEffect(() => {
      if (open) {
        previousActiveElementRef.current =
          document.activeElement as HTMLElement;

        const initialFocusElement = resolveElement(focusInitial);
        if (initialFocusElement) {
          initialFocusElement.focus();
        } else {
          const focusable = drawerRef.current?.querySelector(
            focusableSelector
          ) as HTMLElement;
          if (focusable) {
            focusable.focus();
          } else {
            // fallback focus
            drawerRef.current?.focus();
          }
        }
      } else if (previousActiveElementRef.current) {
        const returnFocusElement = resolveElement(focusReturn);
        if (returnFocusElement) {
          returnFocusElement.focus();
        } else {
          // fallback focus
          previousActiveElementRef.current?.focus();
        }
      }
    }, [open, focusInitial, focusReturn]);

    useEscapeKey(
      { callback: handleClose, active: open, defaultPrevented: true },
      [onClose]
    );

    // istanbul ignore next
    if (!isBrowser()) {
      return null;
    }

    const portalElement = resolveElement(portal);

    return createPortal(
      <>
        <ClickOutsideListener
          onClickOutside={handleClose}
          mouseEvent={open ? undefined : false}
          touchEvent={open ? undefined : false}
          target={drawerRef}
        >
          <FocusTrap
            active={!!isModal && !!open}
            focusTrapOptions={{
              allowOutsideClick: true,
              escapeDeactivates: false,
              clickOutsideDeactivates: false,
              initialFocus: false,
              setReturnFocus: false,
              fallbackFocus: () => drawerRef.current
            }}
          >
            <div
              ref={drawerRef}
              className={classnames(className, 'Drawer', {
                'Drawer--open': !!open,
                'Drawer--top': position === 'top',
                'Drawer--bottom': position === 'bottom',
                'Drawer--left': position === 'left',
                'Drawer--right': position === 'right'
              })}
              aria-hidden={!open || undefined}
              style={{
                visibility: !open && !isTransitioning ? 'hidden' : undefined,
                ...style
              }}
              tabIndex={open ? -1 : undefined}
              {...props}
            >
              {children}
            </div>
          </FocusTrap>
        </ClickOutsideListener>
        <Scrim show={!!open && !!isModal} />
      </>,
      portalElement ||
        // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
        document?.body
    ) as React.JSX.Element;
  }
);

Drawer.displayName = 'Drawer';

export default Drawer;

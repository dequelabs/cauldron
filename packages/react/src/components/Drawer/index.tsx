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

interface DrawerProps<T extends HTMLElement = HTMLElement>
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  open?: boolean;
  hideScrim?: boolean;
  focusTrap?: boolean;
  focusOptions: {
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
      hideScrim = false,
      focusTrap = false,
      focusOptions = {},
      portal,
      onClose = () => null,
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

    const handleClose = useCallback(() => {
      if (open && typeof onClose === 'function') {
        onClose();
      }
    }, [open, onClose]);

    useEffect(() => {
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

    return createPortal(
      <>
        <ClickOutsideListener
          onClickOutside={handleClose}
          mouseEvent={open ? undefined : false}
          touchEvent={open ? undefined : false}
          target={drawerRef}
        >
          <FocusTrap
            active={!!focusTrap && open}
            focusTrapOptions={{
              allowOutsideClick: true,
              escapeDeactivates: false,
              clickOutsideDeactivates: false,
              initialFocus: false,
              setReturnFocus: false
            }}
          >
            <div
              ref={drawerRef}
              className={classnames(className, 'Drawer', {
                'Drawer--open': open,
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
        <Scrim show={!!open && !hideScrim} />
      </>,
      (portal && 'current' in portal ? portal.current : portal) ||
        // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
        document?.body
    );
  }
);

Drawer.displayName = 'Drawer';

export default Drawer;

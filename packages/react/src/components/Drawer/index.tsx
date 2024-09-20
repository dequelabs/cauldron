import React, {
  forwardRef,
  useState,
  useEffect,
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

interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  open?: boolean;
  hideScrim?: boolean;
  focusTrap?: boolean;
  focusInitial?:
    | HTMLElement
    | React.RefObject<HTMLElement>
    | React.MutableRefObject<HTMLElement>;
  focusReturn?:
    | HTMLElement
    | React.RefObject<HTMLElement>
    | React.MutableRefObject<HTMLElement>;
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
      focusInitial,
      focusReturn,
      portal,
      onClose = () => null,
      style,
      ...props
    },
    ref
  ) => {
    const drawerRef = useSharedRef(ref);
    const initialFocusRef = useRef<HTMLElement | undefined>(
      focusInitial && 'current' in focusInitial
        ? focusInitial.current
        : focusInitial
    );
    const focusReturnRef = useRef<HTMLElement | undefined>(
      focusReturn && 'current' in focusReturn
        ? focusReturn.current
        : focusReturn
    );
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
      setIsTransitioning(true);
    }, [open]);

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
              initialFocus: () => {
                if (initialFocusRef.current) {
                  initialFocusRef.current.focus();
                  return false;
                }
              },
              setReturnFocus: (previousActiveElement) => {
                return focusReturnRef.current || previousActiveElement;
              }
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

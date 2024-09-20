import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import classnames from 'classnames';
import Scrim from '../Scrim';
import ClickOutsideListener from '../ClickOutsideListener';
import useEscapeKey from '../../utils/useEscapeKey';
import useSharedRef from '../../utils/useSharedRef';

interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  open?: boolean;
  hideScrim?: boolean;
  trapFocus?: boolean;
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
      trapFocus = false,
      portal,
      onClose = () => null,
      ...props
    },
    ref
  ) => {
    const drawerRef = useSharedRef(ref);
    const [active, setActive] = useState(!!open);

    useEffect(() => {
      const transitionHandler = () => {
        if (!open) {
          setActive(false);
        }
      };

      if (open) {
        setActive(true);
        document.addEventListener('transitionend', transitionHandler);
      }

      return () => {
        document.removeEventListener('transitionend', transitionHandler);
      };
    }, [open]);

    const handleClickOutside = useCallback(() => {
      if (open && typeof onClose === 'function') {
        onClose();
      }
    }, [open]);

    useEscapeKey({ callback: onClose, active: open, defaultPrevented: true }, [
      onClose
    ]);

    return createPortal(
      <>
        <ClickOutsideListener
          onClickOutside={handleClickOutside}
          mouseEvent={open ? undefined : false}
          touchEvent={open ? undefined : false}
        >
          <FocusTrap
            active={!!trapFocus && open}
            focusTrapOptions={{
              escapeDeactivates: false,
              clickOutsideDeactivates: false,
              fallbackFocus: drawerRef.current
            }}
          >
            <div
              className={classnames(className, 'Drawer', {
                'Drawer--open': open,
                'Drawer--top': position === 'top',
                'Drawer--bottom': position === 'bottom',
                'Drawer--left': position === 'left',
                'Drawer--right': position === 'right'
              })}
              aria-hidden={!active}
              style={{ visibility: !active ? 'hidden' : undefined }}
              tabIndex={-1}
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

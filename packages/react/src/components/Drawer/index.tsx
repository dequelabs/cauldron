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
  focusTrap?: boolean;
  open?: boolean;
  hideScrim?: boolean;
  onClose?: () => void;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      children,
      className,
      open = false,
      position,
      focusTrap,
      hideScrim = false,
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
      if (open) {
        onClose();
      }
    }, [open]);

    useEscapeKey(() => onClose(), { active: open, defaultPrevented: true }, [
      onClose
    ]);

    return createPortal(
      <>
        <FocusTrap
          active={!!focusTrap}
          focusTrapOptions={{
            escapeDeactivates: false,
            clickOutsideDeactivates: false,
            fallbackFocus: drawerRef.current
          }}
        >
          <ClickOutsideListener
            onClickOutside={handleClickOutside}
            mouseEvent={open ? undefined : false}
            touchEvent={open ? undefined : false}
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
              aria-hidden={!active}
              style={{ visibility: !active ? 'hidden' : undefined }}
              tabIndex={-1}
            >
              {children}
            </div>
          </ClickOutsideListener>
        </FocusTrap>
        <Scrim show={!!open && !hideScrim} />
      </>,
      // eslint-disable-next-line
      (portal && 'current' in portal ? portal.current : portal) ||
        document?.body
    );
  }
);

Drawer.displayName = 'Drawer';

export default Drawer;

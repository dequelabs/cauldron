import type { ElementOrRef } from '../../types';
import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { createPortal } from 'react-dom';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import Scrim from '../Scrim';
import ClickOutsideListener from '../ClickOutsideListener';
import useEscapeKey from '../../utils/useEscapeKey';
import useSharedRef from '../../utils/useSharedRef';
import useFocusTrap from '../../utils/useFocusTrap';
import resolveElement from '../../utils/resolveElement';
import AriaIsolate from '../../utils/aria-isolate';
import { isBrowser } from '../../utils/is-browser';
import {
  DrawerContext,
  useDrawerContext,
  type DrawerContextValue
} from './DrawerContext';

export interface DrawerProps<
  T extends HTMLElement = HTMLElement
> extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  open?: boolean;
  behavior?: 'modal' | 'non-modal';
  focusOptions?: {
    initialFocus?: ElementOrRef<T>;
    returnFocus?: ElementOrRef<T>;
  };
  onClose?: () => void;
  portal?: React.RefObject<HTMLElement | null> | HTMLElement;
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
    const [headingId] = useId(1, 'drawer-title-');
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
      if (!isModal || !drawerRef.current) {
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

    useEscapeKey(
      { callback: handleClose, active: open, defaultPrevented: true },
      [onClose]
    );

    // istanbul ignore next
    if (!isBrowser()) {
      return null;
    }

    useFocusTrap(drawerRef, {
      disabled: !isModal || !open,
      initialFocusElement: focusInitial || drawerRef,
      returnFocus: true,
      returnFocusElement: focusReturn
    });

    useEffect(() => {
      if (open && drawerRef.current) {
        const hasHeading = drawerRef.current.querySelector('.Drawer__heading');
        if (process.env.NODE_ENV !== 'production' && !hasHeading) {
          throw Error(
            'Drawer: No heading provided. Include a DrawerHeading component for accessibility.'
          );
        }
      }
    }, [open]);

    const contextValue: DrawerContextValue = useMemo(
      () => ({
        headingId
      }),
      [headingId]
    );

    const portalElement = resolveElement(portal);

    return createPortal(
      <>
        <ClickOutsideListener
          onClickOutside={handleClose}
          mouseEvent={open ? undefined : false}
          touchEvent={open ? undefined : false}
          target={drawerRef}
        >
          <div
            ref={drawerRef}
            role="dialog"
            className={classnames(className, 'Drawer', {
              'Drawer--open': !!open,
              'Drawer--top': position === 'top',
              'Drawer--bottom': position === 'bottom',
              'Drawer--left': position === 'left',
              'Drawer--right': position === 'right'
            })}
            aria-hidden={!open || undefined}
            aria-modal={isModal ? true : undefined}
            aria-labelledby={headingId}
            style={{
              visibility: !open && !isTransitioning ? 'hidden' : undefined,
              ...style
            }}
            tabIndex={open ? -1 : undefined}
            {...props}
          >
            <DrawerContext.Provider value={contextValue}>
              {children}
            </DrawerContext.Provider>
          </div>
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

export interface DrawerHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  level?: number;
}

const DrawerHeading = ({
  children,
  className,
  level = 2,
  ...other
}: DrawerHeadingProps) => {
  const { headingId } = useDrawerContext();
  const HeadingLevel = `h${level}` as 'h1';
  return (
    <HeadingLevel
      className={classnames('Drawer__heading', className)}
      id={headingId}
      {...other}
    >
      {children}
    </HeadingLevel>
  );
};
DrawerHeading.displayName = 'DrawerHeading';

export default Drawer;
export { Drawer, DrawerHeading };

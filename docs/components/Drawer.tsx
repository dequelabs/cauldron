import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import focusable from 'focusable';
import { ClickOutsideListener, Scrim } from '@deque/cauldron-react';
import './Drawer.css';

interface DrawerProps {
  open: boolean;
  children: React.ReactNode;
  active?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function Drawer({
  children,
  open,
  active = true,
  onOpen = () => null,
  onClose = () => null
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerElement = useRef<HTMLElement | null>(null);

  const handleClickOutside = () => {
    if (!open) {
      return;
    }

    onClose();
  };

  // Allow keyboard users to close the drawer with "esc"
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.which === 27 && open) {
        onClose();
        triggerElement.current?.focus();
      }
    };

    document.body.addEventListener('keydown', listener);
    return () => {
      document.body.removeEventListener('keydown', listener);
    };
  }, [open]);

  // Ensure that focusable elements aren't focusable when the drawer is closed
  useEffect(() => {
    const elements = drawerRef.current?.querySelectorAll(focusable) || [];

    if (!open) {
      Array.from(elements).forEach(element => {
        // Note: we just need an typed element to act as an element
        // with a tabIndex attribute
        (element as HTMLInputElement).tabIndex = -1;
      });
    } else {
      triggerElement.current = document.activeElement as HTMLElement;
      Array.from(elements).forEach(element => {
        const tabIndexAttr = Number(element.getAttribute('tabindex'));
        (element as HTMLInputElement).tabIndex =
          typeof tabIndexAttr === 'number' ? tabIndexAttr : 0;
      });
    }
  }, [open]);

  return active ? (
    <>
      <div
        className={classnames('Drawer', { 'Drawer--open': open })}
        ref={drawerRef}
        aria-hidden={!open}
      >
        <ClickOutsideListener onClickOutside={handleClickOutside}>
          {children}
        </ClickOutsideListener>
      </div>
      <Scrim show={open} />
    </>
  ) : (
    children
  );
}

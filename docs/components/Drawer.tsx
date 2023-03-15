import React, { useEffect, useState } from 'react';
import { ClickOutsideListener, Scrim } from '@deque/cauldron-react';

interface DrawerProps {
  open: boolean;
  children: React.ReactNode;
  target?: React.RefObject<HTMLElement>;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function Drawer({
  children,
  open,
  target,
  onOpen = () => null,
  onClose = () => null
}: DrawerProps) {
  const handleClickOutside = () => {
    if (!open) {
      return;
    }

    onClose();
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.which === 27 && open) {
        onClose();
      }
    };

    document.body.addEventListener('keydown', listener);
    return () => {
      document.body.removeEventListener('keydown', listener);
    };
  });

  useEffect(() => {
    document.body.classList.toggle('drawer--open', open);
    document.body.classList.toggle('drawer--closed', !open);
    return () => {
      document.body.classList.toggle('drawer--open', false);
      document.body.classList.toggle('drawer--closed', false);
    };
  }, [open]);

  return (
    <>
      <ClickOutsideListener
        target={target?.current}
        onClickOutside={handleClickOutside}
      >
        {children}
      </ClickOutsideListener>
      <Scrim show={open} />
    </>
  );
}

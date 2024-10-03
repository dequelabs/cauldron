import React, { useState, useRef } from 'react';
import OptionsMenuWrapper from './OptionsMenuWrapper';
import OptionsMenuList from './OptionsMenuList';
import setRef from '../../utils/setRef';

const [down] = [40];

export interface OptionsMenuAlignmentProps {
  align?: 'left' | 'right';
}

export interface OptionsMenuRenderTriggerProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  'aria-expanded': boolean;
  ref: React.Ref<HTMLButtonElement>;
}

export interface OptionsMenuProps extends OptionsMenuAlignmentProps {
  id?: string;
  className?: string;
  menuRef?: React.Ref<HTMLUListElement>;
  trigger?: (props: OptionsMenuRenderTriggerProps) => React.ReactNode;
  onClose?: () => void;
  onSelect: (e: React.MouseEvent<HTMLElement>) => void;
  closeOnSelect?: boolean;
  show?: boolean;
  children: React.ReactNode;
}

type AllOptionsMenuProps = OptionsMenuProps &
  React.HTMLAttributes<HTMLLIElement>;

const OptionsMenu = ({
  children,
  className,
  closeOnSelect,
  menuRef,
  trigger,
  align = 'right',
  onClose = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  onSelect = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  ...other
}: AllOptionsMenuProps) => {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setShow(!show);
  };

  const handleClose = () => {
    setShow(false);
    onClose();
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const { which, target } = event;
    if (which === down) {
      event.preventDefault();
      (target as HTMLElement).click();
    }
  };

  return (
    <OptionsMenuWrapper align={align} className={className}>
      {trigger &&
        trigger({
          onClick: toggleMenu,
          'aria-expanded': show,
          ref: triggerRef,
          onKeyDown: handleTriggerKeyDown
        })}
      <OptionsMenuList
        triggerRef={triggerRef}
        show={show}
        menuRef={(el) => {
          if (menuRef) {
            setRef(menuRef, el);
          }
        }}
        onClose={handleClose}
        onSelect={onSelect}
        {...other}
      >
        {children}
      </OptionsMenuList>
    </OptionsMenuWrapper>
  );
};

export default OptionsMenu;

import React, { useState, useRef, useEffect } from 'react';
import { OptionsMenuProps } from './OptionsMenu';
import ClickOutsideListener from '../ClickOutsideListener';
import classnames from 'classnames';
import setRef from '../../utils/setRef';

const [up, down, tab, enter, space, esc] = [38, 40, 9, 13, 32, 27];

export interface OptionsMenuListProps
  extends Omit<OptionsMenuProps, 'trigger'> {
  className?: string;
}

const OptionsMenuList = ({
  children,
  menuRef,
  show,
  className,
  onClose = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  onSelect = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  closeOnSelect = true,
  ...other
}: OptionsMenuListProps) => {
  const [itemIndex, setItemIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const menuRefInternal = useRef<HTMLUListElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (show && itemRefs.current.length) {
      // handles opens
      triggerRef.current = document.activeElement as HTMLButtonElement;
      itemRefs.current[0]?.focus();
      setItemIndex(0);
    }
    if (!show) {
      triggerRef.current = null;
    }
  }, [show]);

  useEffect(() => {
    itemRefs.current[itemIndex]?.focus();
  }, [itemIndex]);

  const handleKeyDown = (e: KeyboardEvent) => {
    const { which, target } = e;
    switch (which) {
      case up:
      case down: {
        const itemCount = itemRefs.current.length;
        let newIndex = which === 38 ? itemIndex - 1 : itemIndex + 1;

        // circularity
        if (newIndex === -1) {
          newIndex = itemCount - 1;
        } else if (newIndex === itemCount) {
          newIndex = 0;
        }

        e.preventDefault();
        setItemIndex(newIndex);
        break;
      }
      case esc:
        onClose();
        break;
      case enter:
      case space:
        e.preventDefault();
        (target as HTMLElement).click();
        break;
      case tab:
        e.preventDefault();
        onClose();
    }
  };

  useEffect(() => {
    const currentMenuRef = menuRefInternal.current;
    currentMenuRef?.addEventListener('keydown', handleKeyDown);
    return () => {
      currentMenuRef?.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (
      menuRefInternal.current &&
      menuRefInternal.current.contains(e.target as HTMLElement)
    ) {
      if (!e.defaultPrevented && closeOnSelect) {
        onClose();
      }
      onSelect(e);
    }

    const link = (e.target as HTMLElement).querySelector('a');
    if (link) {
      link.click();
    }
  };

  const handleClickOutside = (e: MouseEvent | TouchEvent) => {
    const target = e.target as Node;
    const triggerElement = triggerRef.current;
    if (target === triggerElement || triggerElement?.contains(target)) {
      return;
    }
    if (show) {
      e.preventDefault();
      onClose();
    }
  };

  const items = React.Children.toArray(children).map((child, i) => {
    const { className: childClassName, ...childProps } = (
      child as React.ReactElement<any>
    ).props;
    return React.cloneElement(child as React.ReactElement<any>, {
      key: `list-item-${i}`,
      className: classnames('OptionsMenu__list-item', childClassName),
      tabIndex: -1,
      role: 'menuitem',
      ref: (el: HTMLLIElement) => (itemRefs.current[i] = el),
      ...childProps
    });
  });

  // This allows the ClickOutsideListener to only be activated when the menu is
  // currently open. This prevents an obscure behavior where the activation of a
  // different menu would cause all menus to close
  const clickOutsideEventActive = !show ? false : undefined;

  // Key event is being handled in the useEffect above
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/role-supports-aria-props */
  return (
    <ClickOutsideListener
      onClickOutside={handleClickOutside}
      mouseEvent={clickOutsideEventActive}
      touchEvent={clickOutsideEventActive}
    >
      <ul
        {...other}
        className={classnames('OptionsMenu__list', className)}
        /* aria-expanded is not correct usage here, but the pattern library
        currently styles the open state of the menu based on this attribute */
        aria-expanded={show}
        role="menu"
        onClick={handleClick}
        ref={(el) => {
          menuRefInternal.current = el;
          if (menuRef) {
            setRef(menuRef, el);
          }
        }}
      >
        {items}
      </ul>
    </ClickOutsideListener>
  );
};

export default OptionsMenuList;

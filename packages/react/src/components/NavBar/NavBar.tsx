import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEventHandler
} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import { useId } from 'react-id-generator';

interface NavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  collapsed?: boolean;
  navTriggerLabel?: string;
  propId?: string;
}

const NavBar = ({
  children,
  className,
  collapsed = false,
  navTriggerLabel = 'MAIN MENU',
  propId,
  ...props
}: NavBarProps) => {
  const navRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuId] = [propId] || useId(1, 'navbar');
  const showNavItems = !collapsed || (collapsed && showDropdown);

  const handleOutSideEvent = (e: FocusEvent | MouseEvent) => {
    const target = e.target as HTMLElement;
    if (navRef.current && !navRef.current?.contains(target)) {
      setShowDropdown(false);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLUListElement> = (
    e: React.KeyboardEvent<HTMLUListElement>
  ) => {
    if (e.key !== 'Escape') {
      return;
    }

    setShowDropdown(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (collapsed && showDropdown) {
      document.addEventListener('focusin', handleOutSideEvent);

      return () => {
        document.removeEventListener('focusin', handleOutSideEvent);
      };
    }
  }, [collapsed, showDropdown]);

  const handleTriggerClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav
      className={classNames('NavBar', className, {
        'NavBar--collapsed': collapsed
      })}
      ref={navRef}
      {...props}
    >
      {collapsed && (
        <button
          aria-haspopup="true"
          aria-expanded={showDropdown}
          aria-controls={menuId}
          ref={triggerRef}
          onClick={handleTriggerClick}
          className={classNames('NavBar__trigger', {
            'NavBar__trigger--active': showDropdown
          })}
        >
          <Icon type={showDropdown ? 'close' : 'hamburger-menu'} />
          {navTriggerLabel}
        </button>
      )}
      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
      {showNavItems && (
        <ul onKeyDown={handleKeyDown} id={menuId}>
          {children}
        </ul>
      )}
    </nav>
  );
};

NavBar.displayName = 'NavBar';
NavBar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  collapsed: PropTypes.bool,
  navTriggerLabel: PropTypes.string,
  propId: PropTypes.string
};

export default NavBar;

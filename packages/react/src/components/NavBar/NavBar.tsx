import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import NavItem from './NavItem';
import NavBarTrigger from './NavBarTrigger';
import Scrim from '../Scrim';

interface NavBarProps {
  children: React.ReactNode;
  initialActiveIndex?: number;
  className?: string;
  collapsed?: boolean;
  navTriggerLabel?: string;
}

const NavBar = ({
  children,
  // no initial link as default
  initialActiveIndex = -1,
  className,
  collapsed = false,
  navTriggerLabel = 'MAIN MENU'
}: NavBarProps) => {
  const navRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [showDropdown, setShowDropdown] = useState(false);
  const showNavItems = !collapsed || (collapsed && showDropdown);

  const navItems = React.Children.toArray(children).filter(child => {
    return (child as React.ReactElement<any>).type === NavItem;
  });

  const handleOutSideEvent = (e: FocusEvent | MouseEvent) => {
    const target = e.target as HTMLElement;
    if (navRef.current && !navRef.current?.contains(target)) {
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (collapsed && showDropdown) {
      document.addEventListener('focusin', handleOutSideEvent);
      navRef.current?.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('focusin', handleOutSideEvent);
        navRef.current?.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [collapsed, showDropdown]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    // closes dropdown when a menu is selected
    if (collapsed) {
      setShowDropdown(!showDropdown);
    }
  };

  const handleTriggerClick = () => {
    setShowDropdown(!showDropdown);
  };

  const NavItemComponents = navItems.map((child, index) => {
    const config = {
      className: classNames('NavItem', {
        // calculate index in unfiltered array of nav items
        'NavItem--active': index === activeIndex
      }),
      onClick: () => handleClick(index),
      ...(child as React.ReactElement<any>).props
    };

    return React.cloneElement(child as React.ReactElement<any>, config);
  });

  return (
    <nav
      className={classNames('NavBar', className, {
        'NavBar--trigger': collapsed
      })}
      ref={navRef}
    >
      <Scrim show={showDropdown} />
      {collapsed && (
        <NavBarTrigger
          show={showDropdown}
          handleTriggerClick={handleTriggerClick}
        >
          {navTriggerLabel}
        </NavBarTrigger>
      )}
      <ul>{showNavItems && NavItemComponents}</ul>
    </nav>
  );
};

NavBar.displayName = 'NavBar';
NavBar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  collapsed: PropTypes.bool,
  navTriggerLabel: PropTypes.string
};

export default NavBar;

import React, { useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [showDropdown, setShowDropdown] = useState(false);
  const showNavItems = !collapsed || (collapsed && showDropdown);

  const navItems = React.Children.toArray(children).filter(child => {
    return (child as React.ReactElement<any>).type === NavItem;
  });

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const navItemComponents = navItems.map((child, index) => {
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
    >
      <Scrim show={showDropdown} />
      {collapsed && (
        <NavBarTrigger
          show={showDropdown}
          handleTriggerClick={handleTriggerClick}
          handleKeyDown={handleKeyDown}
        >
          {navTriggerLabel}
        </NavBarTrigger>
      )}
      <ul>{showNavItems && navItemComponents}</ul>
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

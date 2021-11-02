import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import NavItem from './NavItem';
import NavBarTrigger from './NavBarTrigger';
import { isNarrow } from '../../utils/viewport';
import Scrim from '../Scrim';

interface NavBarProps {
  children: React.ReactNode;
  initialActiveIndex?: number;
  className?: string;
}

const NavBar = ({
  children,
  initialActiveIndex = 0,
  className
}: NavBarProps) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [hasTrigger, setHasTrigger] = useState(isNarrow());
  const [showDropdown, setShowDropdown] = useState(false);
  const navItems = React.Children.toArray(children).filter(
    child => (child as React.ReactElement<any>).type === NavItem
  );
  const navBarTrigger = React.Children.toArray(children).filter(
    child => (child as React.ReactElement<any>).type === NavBarTrigger
  );
  const navItemCount = navItems.length;

  const handleClick = (index: number) => {
    setActiveIndex(index);
    // closes dropdown when a menu is selected
    if (hasTrigger) {
      setShowDropdown(!showDropdown);
    }
  };

  const handleWindowResize = useCallback(() => {
    const narrow = isNarrow();
    setHasTrigger(narrow);
    // close dropdown when viewport is enlarged
    if (!narrow) {
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  const handleTriggerClick = () => {
    setShowDropdown(!showDropdown);
  };

  const navItemComponents = navItems.map((child, index) => {
    const { show = true, ...other } = (child as React.ReactElement<any>).props;

    const config = {
      className: classNames('NavItem', {
        'NavItem--hidden': !show,
        'NavItem--active': index === activeIndex
      }),
      onClick: () => handleClick(index),
      ...other
    };

    return React.cloneElement(child as React.ReactElement<any>, config);
  });

  const navItemComponentsWithTrigger = (
    <>
      <NavBarTrigger
        show={showDropdown}
        handleTriggerClick={handleTriggerClick}
      >
        MAIN MENU
      </NavBarTrigger>
      {showDropdown && navItemComponents}
    </>
  );

  return (
    <nav
      className={classNames('NavBar', className, {
        'NavBar--trigger': hasTrigger
      })}
    >
      <Scrim show={showDropdown} />
      <ul>{hasTrigger ? navItemComponentsWithTrigger : navItemComponents}</ul>
    </nav>
  );
};

NavBar.displayName = 'Navbar';
NavBar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default NavBar;

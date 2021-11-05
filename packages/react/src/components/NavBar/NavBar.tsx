import React, { useState, useEffect, useRef } from 'react';
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
  const navRef = useRef<HTMLElement>(null);

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

  const handleNavBarFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (target?.matches('li.NavItem a')) {
      // target.scrollIntoView();
      const targetWidth = target.offsetWidth;
      console.log({ targetWidth });
      console.log(
        'before',
        navRef.current?.scrollTop,
        navRef.current?.scrollLeft
      );
      navRef.current?.scrollTo({
        top: navRef.current?.scrollTop,
        left: navRef.current?.scrollLeft + targetWidth,
        behavior: 'smooth'
      });
      console.log(
        'after',
        navRef.current?.scrollTop,
        navRef.current?.scrollLeft
      );
    }
  };

  useEffect(() => {
    navRef.current?.addEventListener('focusin', handleNavBarFocus);
    return () => {
      navRef.current?.removeEventListener('focusin', handleNavBarFocus);
    };
  }, [navRef.current]);

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

  const navItemComponentsWithTrigger = (
    <>
      <NavBarTrigger
        show={showDropdown}
        handleTriggerClick={handleTriggerClick}
      >
        {navTriggerLabel}
      </NavBarTrigger>
      {showDropdown && navItemComponents}
    </>
  );

  return (
    <nav
      className={classNames('NavBar', className, {
        'NavBar--trigger': collapsed
      })}
      ref={navRef}
    >
      <Scrim show={showDropdown} />
      <ul>{collapsed ? navItemComponentsWithTrigger : navItemComponents}</ul>
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

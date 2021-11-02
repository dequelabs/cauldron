import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import NavItem from './NavItem';

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
  const navItems = React.Children.toArray(children).filter(
    child => (child as React.ReactElement<any>).type === NavItem
  );

  const handleClick = (index: number) => {
    setActiveIndex(index);
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

  return (
    <nav className={classNames('NavBar', className)}>
      <ul>{navItemComponents}</ul>
    </nav>
  );
};

NavBar.displayName = 'Navbar';
NavBar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default NavBar;

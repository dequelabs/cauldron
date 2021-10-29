import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

interface NavbarProps {
  currentPath: string;
  children: React.ReactNode;
  className?: string;
}

const Navbar = ({ children, className }: NavbarProps) => {
  return (
    <nav className={classNames('Navbar', className)}>
      <ul>{children}</ul>
    </nav>
  );
};

Navbar.displayName = 'Navbar';
Navbar.propTypes = {
  currentPath: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Navbar;

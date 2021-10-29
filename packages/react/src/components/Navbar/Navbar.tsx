import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

interface NavbarProps {
  children: React.ReactNode;
  thin?: boolean;
  className?: string;
}

const Navbar = ({ children, thin, className }: NavbarProps) => {
  return (
    <nav
      className={classNames('Navbar', className, {
        'Navbar--thin': thin
      })}
    >
      <ul>{children}</ul>
    </nav>
  );
};

Navbar.displayName = 'Navbar';
Navbar.propTypes = {
  children: PropTypes.node.isRequired,
  thin: PropTypes.bool,
  className: PropTypes.string
};

export default Navbar;

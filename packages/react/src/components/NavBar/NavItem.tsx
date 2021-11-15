import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface NavItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  active: boolean;
}

const NavItem = ({ children, active, ...other }: NavItemProps): JSX.Element => (
  <li
    className={classNames('NavItem', {
      'NavItem--active': active
    })}
    {...other}
  >
    {children}
  </li>
);

NavItem.displayName = 'NavItem';
NavItem.propTypes = {
  children: PropTypes.node.isRequired
};

export default NavItem;

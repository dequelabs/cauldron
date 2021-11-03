import React from 'react';
import PropTypes from 'prop-types';

interface NavItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

const NavItem = ({ children, ...other }: NavItemProps): JSX.Element => (
  <li {...other}>{children}</li>
);

NavItem.displayName = 'NavItem';
NavItem.propTypes = {
  children: PropTypes.node.isRequired
};

export default NavItem;

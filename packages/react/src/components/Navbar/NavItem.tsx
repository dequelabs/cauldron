import React from 'react';
import PropTypes from 'prop-types';

interface NavItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  handleClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  show?: boolean;
}

const NavItem = ({ children, ...other }: NavItemProps): JSX.Element => (
  <li {...other}>{children}</li>
);

NavItem.displayName = 'NavItem';
NavItem.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool
};

export default NavItem;

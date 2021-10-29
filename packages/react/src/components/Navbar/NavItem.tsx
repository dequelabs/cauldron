import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface NavItemProps extends React.HTMLAttributes<HTMLLIElement> {
  path: string;
  children: React.ReactNode;
  show?: boolean;
  className?: string;
}

const NavItem = ({
  path,
  children,
  show = true,
  className,
  ...other
}: NavItemProps): JSX.Element => (
  <li
    className={classNames('NavItem', className, {
      'NavItem--hidden': !show
    })}
    {...other}
  >
    {children}
  </li>
);

NavItem.displayName = 'NavItem';
NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  show: PropTypes.bool,
  className: PropTypes.string
};

export default NavItem;

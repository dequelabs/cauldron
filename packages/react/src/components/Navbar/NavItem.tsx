import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';

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
}: NavItemProps): JSX.Element => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const { pathname } = location;
    setIsActive(pathname === path);
  }, [location]);

  return (
    <li
      className={classNames('NavItem', className, {
        'NavItem--hidden': !show,
        'NavItem--current': isActive
      })}
      {...other}
    >
      <Link to={path} aria-current={isActive}>
        {children}
      </Link>
    </li>
  );
};

NavItem.displayName = 'NavItem';
NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  show: PropTypes.bool,
  className: PropTypes.string
};

export default NavItem;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

interface NavBarTriggerProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  show: boolean;
  handleTriggerClick: () => void;
}

const NavBarTrigger: React.ComponentType<NavBarTriggerProps> = ({
  children,
  className,
  show,
  handleTriggerClick = () => {},
  ...other
}) => (
  <li
    aria-haspopup="true"
    className={classNames('NavBar__menu-trigger', className)}
    {...other}
  >
    <button
      tabIndex={-1}
      aria-haspopup="true"
      aria-expanded={show}
      onClick={handleTriggerClick}
    >
      <Icon type="hamburger-menu" />
      {children}
    </button>
  </li>
);

NavBarTrigger.displayName = 'NavBarTrigger';
NavBarTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired,
  handleTriggerClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default NavBarTrigger;

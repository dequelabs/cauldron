import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

interface NavBarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  show: boolean;
  handleTriggerClick: () => void;
}

const NavBarTrigger: React.ComponentType<NavBarTriggerProps> = ({
  children,
  className,
  show = false,
  handleTriggerClick = () => null,
  ...other
}) => (
  <button
    aria-haspopup="true"
    aria-expanded={show}
    onClick={handleTriggerClick}
    className={classNames('NavBar__menu-trigger', className, {
      'NavBar__menu-trigger--active': show
    })}
    {...other}
  >
    <Icon type={show ? 'close' : 'hamburger-menu'} />
    {children}
  </button>
);

NavBarTrigger.displayName = 'NavBarTrigger';
NavBarTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired,
  handleTriggerClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default NavBarTrigger;

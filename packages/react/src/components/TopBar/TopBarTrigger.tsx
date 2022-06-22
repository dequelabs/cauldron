import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MenuItem from '../MenuItem';

interface TopBarTriggerProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

const TopBarTrigger: React.ComponentType<React.PropsWithChildren<
  TopBarTriggerProps
>> = ({ children, className, ...other }) => (
  <MenuItem
    aria-haspopup="true"
    className={classNames('TopBar__menu-trigger', className)}
    {...other}
  >
    {children}
  </MenuItem>
);
TopBarTrigger.displayName = 'TopBarTrigger';
TopBarTrigger.propTypes = {
  // @ts-expect-error
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default TopBarTrigger;

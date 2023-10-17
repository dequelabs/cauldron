import React from 'react';
import classNames from 'classnames';
import MenuItem from '../MenuItem';

interface TopBarTriggerProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  className?: string;
}

const TopBarTrigger: React.ComponentType<
  React.PropsWithChildren<TopBarTriggerProps>
> = ({ children, className, ...other }) => (
  <MenuItem
    aria-haspopup="true"
    className={classNames('TopBar__menu-trigger', className)}
    {...other}
  >
    {children}
  </MenuItem>
);
TopBarTrigger.displayName = 'TopBarTrigger';

export default TopBarTrigger;

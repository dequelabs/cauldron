import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import keyname from 'keyname';
import { isWide } from '../../utils/viewport';

export interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'light' | 'dark';
}

const TopBar = (props: TopBarProps) => {
  const { children, className, variant = 'dark', ...other } = props;
  return (
    <div
      className={classNames(className, {
        TopBar: true,
        'TopBar--light': variant === 'light'
      })}
      {...other}
    >
      {children}
    </div>
  );
};

export default TopBar;

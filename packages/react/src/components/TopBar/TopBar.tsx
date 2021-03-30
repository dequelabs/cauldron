import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import keyname from 'keyname';
import { isWide } from '../../utils/viewport';

export interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TopBar = (props: TopBarProps) => {
  const { children, className, ...other } = props;
  return (
    <div className={classNames('TopBar', className)} {...other}>
      {children}
    </div>
  );
};

export default TopBar;

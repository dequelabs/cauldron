import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import keyname from 'keyname';
import Scrim from '../Scrim';
import ClickOutsideListener from '../ClickOutsideListener';
import { isWide } from '../../utils/viewport';
import focusableSelector from '../../utils/focusable-selector';

export interface SideBarProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
  onDismiss: () => void;
  className?: string;
  show: boolean;
  navProps?: React.HTMLAttributes<HTMLElement>;
}

const SideBar = ({
  children,
  onDismiss,
  className,
  show,
  navProps
}: SideBarProps) => {
  return <div>{children}</div>;
};

export default SideBar;

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Placement } from '@popperjs/core';
import Icon from '../Icon';
import Tooltip from '../Tooltip';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  tooltipPlacement?: Placement;
}

export default function IconButton({
  icon,
  label,
  tooltipPlacement = 'auto',
  className,
  ...other
}: IconButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <React.Fragment>
      <button
        type={'button'}
        className={classnames('IconButton', className)}
        ref={buttonRef}
        {...other}
      >
        <Icon type={icon} />
      </button>
      <Tooltip target={buttonRef} placement={tooltipPlacement}>
        {label}
      </Tooltip>
    </React.Fragment>
  );
}

IconButton.displayName = 'IconButton';

IconButton.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  tooltipPlayemnt: PropTypes.string,
  buttonRef: PropTypes.any
};

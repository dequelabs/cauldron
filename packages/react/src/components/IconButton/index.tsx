import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  MutableRefObject
} from 'react';
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
  variant?: 'light' | 'dark' | 'primary' | 'secondary' | 'error';
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      tooltipPlacement = 'auto',
      className,
      variant = 'secondary',
      ...other
    }: IconButtonProps,
    ref
  ): JSX.Element => {
    const buttonRef = useRef() as MutableRefObject<HTMLButtonElement>;
    useImperativeHandle(ref, () => buttonRef.current);
    return (
      <React.Fragment>
        <button
          type={'button'}
          className={classnames(className, {
            IconButton: true,
            'IconButton--light': variant === 'light',
            'IconButton--dark': variant === 'dark',
            'IconButton--primary': variant === 'primary',
            'IconButton--secondary': variant === 'secondary',
            'IconButton--error': variant === 'error'
          })}
          ref={buttonRef}
          {...other}
        >
          <Icon type={icon} />
        </button>
        <Tooltip
          target={buttonRef}
          placement={tooltipPlacement}
          association="aria-labelledby"
          hideElementOnHidden
        >
          {label}
        </Tooltip>
      </React.Fragment>
    );
  }
);

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  // @ts-ignore
  tooltipPlacement: PropTypes.string,
  // @ts-ignore
  variant: PropTypes.string
};

IconButton.displayName = 'IconButton';

export default IconButton;

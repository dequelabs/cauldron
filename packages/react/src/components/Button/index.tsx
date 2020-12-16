import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'link';
  thin?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      thin,
      children,
      className,
      startIcon,
      endIcon,
      ...other
    }: ButtonProps,
    buttonRef
  ) => {
    const leftIcon = startIcon && (
      <span
        className={classNames({ 'Button--start-icon': Boolean(startIcon) })}
      >
        {startIcon}
      </span>
    );

    const rightIcon = endIcon && (
      <span className={classNames({ 'Button--end-icon': Boolean(endIcon) })}>
        {endIcon}
      </span>
    );

    return (
      <button
        type={'button'}
        className={classNames(className, {
          'Button--primary': variant === 'primary',
          'Button--secondary': variant === 'secondary',
          'Button--error': variant === 'error',
          Link: variant === 'link',
          'Button--thin': thin
        })}
        ref={buttonRef}
        {...other}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

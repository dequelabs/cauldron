import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'link';
  thin?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', thin, children, className, ...other }: ButtonProps,
    buttonRef
  ) => {
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
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

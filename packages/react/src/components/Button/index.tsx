import React, { ButtonHTMLAttributes, forwardRef, Ref } from 'react';
import classNames from 'classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonRef?: Ref<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'error' | 'link';
  thin?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      thin,
      children,
      className,
      buttonRef,
      ...other
    }: ButtonProps,
    ref
  ) => {
    if (buttonRef) {
      console.warn(
        "%c Warning: 'buttonRef' prop is deprecated, please use 'ref'. ",
        'background: #222; color: #bada44'
      );
    }

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
        ref={ref || buttonRef}
        {...other}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

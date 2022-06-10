import React, { ButtonHTMLAttributes, forwardRef, Ref } from 'react';
import classNames from 'classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonRef?: Ref<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'error' | 'link' | 'tag';
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
  ) => (
    <button
      type={'button'}
      className={classNames(className, {
        'Button--primary': variant === 'primary',
        'Button--secondary': variant === 'secondary',
        'Button--error': variant === 'error',
        Link: variant === 'link',
        Tag: variant === 'tag',
        'Button--thin': thin
      })}
      ref={ref || buttonRef}
      {...other}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export default Button;

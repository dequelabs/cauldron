import React, { type ButtonHTMLAttributes, forwardRef, type Ref } from 'react';
import classNames from 'classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonRef?: Ref<HTMLButtonElement>;
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'error'
    | 'danger'
    | 'danger-secondary'
    | 'link'
    | 'tag'
    | 'badge';
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
      type="button"
      className={classNames(className, {
        'Button--primary': variant === 'primary',
        'Button--secondary': variant === 'secondary',
        'Button--error': variant === 'error',
        'Button--danger': variant === 'danger',
        'Button--danger-secondary': variant === 'danger-secondary',
        'Button--tertiary': variant === 'tertiary',
        Link: variant === 'link',
        Tag: variant === 'tag',
        'Button--tag': variant === 'tag',
        'Button--thin': thin,
        'Button--badge': variant === 'badge'
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

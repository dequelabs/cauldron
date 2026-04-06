import React, { type ButtonHTMLAttributes, forwardRef, type Ref } from 'react';
import classNames from 'classnames';
import type { TagSize } from '../Tag';

interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonRef?: Ref<HTMLButtonElement>;
  thin?: boolean;
}

interface ButtonTagProps extends ButtonBaseProps {
  variant: 'tag';
  size?: TagSize;
}

interface ButtonNonTagProps extends ButtonBaseProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'error'
    | 'danger'
    | 'danger-secondary'
    | 'link'
    | 'badge';
  size?: never;
}

export type ButtonProps = ButtonTagProps | ButtonNonTagProps;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      thin,
      size = 'default',
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
        'Tag--small': variant === 'tag' && size === 'small',
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

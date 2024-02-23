import React, { forwardRef } from 'react';
import classNames from 'classnames';

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  linkRef?: React.Ref<HTMLAnchorElement>;
  variant?: 'button' | 'button-secondary';
  thin?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { children, linkRef, className, variant, thin, ...other }: LinkProps,
    ref
  ) => {
    return (
      <a
        ref={ref || linkRef}
        className={classNames(className, {
          Link: !variant,
          'Button--primary': variant === 'button',
          'Button--secondary': variant === 'button-secondary',
          'Button--thin': thin
        })}
        {...other}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export default Link;

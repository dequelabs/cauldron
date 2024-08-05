import React, { forwardRef } from 'react';
import classNames from 'classnames';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'default' | 'small';
}

interface BadgeLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BadgeLabel = forwardRef<HTMLDivElement, BadgeLabelProps>(
  ({ children, className, ...other }, ref) => (
    <div ref={ref} className={classNames('Badge__Label', className)} {...other}>
      {children}
    </div>
  )
);

BadgeLabel.displayName = 'BadgeLabel';

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, className, size = 'default', ...other }, ref) => (
    <div
      className={classNames('Badge', className, {
        'Badge--small': size === 'small'
      })}
      ref={ref}
      {...other}
    >
      {children}
    </div>
  )
);
Badge.displayName = 'Badge';
export default Badge;

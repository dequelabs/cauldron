import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';

interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  size?: 'default' | 'small';
}

interface BadgeLabelProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const BadgeLabel = ({
  children,
  className,
  ...other
}: BadgeLabelProps) => (
  <div className={classNames('Badge__Label', className)} {...other}>
    {children}
  </div>
);
BadgeLabel.displayName = 'BadgeLabel';

const Badge = ({
  children,
  className,
  size = 'default',
  ...other
}: BadgeProps) => (
  <div
    className={classNames('Badge', className, {
      'Badge--small': size === 'small'
    })}
    {...other}
  >
    {children}
  </div>
);
Badge.displayName = 'Badge';
export default Badge;

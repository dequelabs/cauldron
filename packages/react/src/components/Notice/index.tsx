import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import Icon, { IconType } from '../Icon';
import { ContentNode } from '../../types';

const iconTypeMap = {
  caution: 'caution',
  danger: 'caution',
  info: 'info-circle'
};

export interface NoticeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  type?: keyof typeof iconTypeMap;
  title: ContentNode;
  icon?: IconType;
  variant?: 'default' | 'condensed';
  children?: ReactNode;
}

const Notice = forwardRef<HTMLDivElement, NoticeProps>(
  (
    {
      type = 'info',
      title,
      icon,
      variant = 'default',
      children,
      ...otherProps
    }: NoticeProps,
    ref
  ) => {
    return (
      <div
        className={classNames('Notice', {
          [`Notice--${type}`]: type,
          [`Notice--condensed`]: variant === 'condensed'
        })}
        ref={ref}
        {...otherProps}
      >
        <Icon type={icon || (iconTypeMap[type] as IconType)} />
        <div className="Notice__title">{title}</div>
        {children && <div className="Notice__content">{children}</div>}
      </div>
    );
  }
);

Notice.displayName = 'Notice';

export default Notice;

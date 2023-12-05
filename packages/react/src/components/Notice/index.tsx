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
  children?: ReactNode;
}

const Notice = forwardRef<HTMLDivElement, NoticeProps>(
  (
    { type = 'info', title, icon, children, ...otherProps }: NoticeProps,
    ref
  ) => {
    return (
      <div
        className={classNames('Notice', {
          [`Notice--${type}`]: type
        })}
        ref={ref}
        {...otherProps}
      >
        <div className="Notice__title">
          <Icon type={icon || (iconTypeMap[type] as IconType)} />
          {title}
        </div>
        {children && <div className="Notice__content">{children}</div>}
      </div>
    );
  }
);

Notice.displayName = 'Notice';

export default Notice;

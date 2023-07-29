import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon, { iconTypes, IconType } from '../Icon';

type NoticeType = 'caution' | 'info';

export interface NoticeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  type?: NoticeType;
  title: React.ReactNode;
  icon?: IconType;
  children: React.ReactNode;
}

const iconTypeMap = {
  caution: 'caution',
  info: 'info-circle'
};

/**
 * The cauldron Notice notification component
 */
const Notice = forwardRef<HTMLDivElement, NoticeProps>(
  (
    { type = 'info', title, icon, children, ...otherProps }: NoticeProps,
    ref
  ) => {
    const iconType =
      icon && iconTypes.includes(icon) ? icon : (iconTypeMap[type] as IconType);

    console.log('iconType', iconType);
    return (
      <div
        className={classNames('Notice', {
          [`Notice--${type}`]: type
        })}
        ref={ref}
        {...otherProps}
      >
        <div className="Notice__title">
          {<Icon type={iconType} />}
          {title}
        </div>
        {children}
      </div>
    );
  }
);

Notice.displayName = 'Notice';
Notice.propTypes = {
  // @ts-expect-error
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['caution', 'info'])
};

export default Notice;

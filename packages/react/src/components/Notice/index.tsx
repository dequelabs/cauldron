import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon, { iconTypes, IconType } from '../Icon';

const iconTypeMap = {
  caution: 'caution',
  info: 'info-circle'
};

export interface NoticeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  type?: keyof typeof iconTypeMap;
  title?: React.ReactNode;
  icon?: IconType;
  children?: React.ReactNode;
}

/**
 * The cauldron Notice notification component
 */
const Notice = forwardRef<HTMLDivElement, NoticeProps>(
  ({ type, title, icon, children, ...otherProps }: NoticeProps, ref) => {
    const validType =
      type && Object.keys(iconTypeMap).includes(type) ? type : 'info';
    const validIcon =
      icon && iconTypes.includes(icon)
        ? icon
        : (iconTypeMap[validType] as IconType);

    const validTitle = () => {
      return (
        <div className="Notice__title">
          {<Icon type={validIcon} />}
          {title}
        </div>
      );
    };

    console.log('iconType', validIcon);
    return (
      <div
        className={classNames('Notice', {
          [`Notice--${type}`]: type
        })}
        ref={ref}
        {...otherProps}
      >
        {title ? validTitle() : null}
        {children && children}
      </div>
    );
  }
);

Notice.displayName = 'Notice';
Notice.propTypes = {
  // @ts-expect-error
  children: PropTypes.node,
  type: PropTypes.oneOf(['caution', 'info']),
  // @ts-expect-error
  title: PropTypes.node
};

export default Notice;

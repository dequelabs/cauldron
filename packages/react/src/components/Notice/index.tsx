import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon, { IconType } from '../Icon';
import AriaIsolate from '../../utils/aria-isolate';
import { typeMap, tabIndexHandler } from './utils';
import setRef from '../../utils/setRef';

export interface NoticeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  type: 'success' | 'caution' | 'danger' | 'info';
  title: React.ReactNode;
  icon?: IconType;
  children: React.ReactNode;
}

const mappedType = (type: NoticeProps['type'] = 'info') => typeMap[type];

/**
 * The cauldron Notice notification component
 */
function Notice({
  type = 'info',
  title,
  icon,
  children,
  ...otherProps
}: NoticeProps) {
  const iconType = icon || mappedType(type);
  return (
    <div
      className={classNames('Notice', {
        [`Notice--${type}`]: type
      })}
      {...otherProps}
    >
      {iconType && <Icon type={iconType as IconType} />}
      {title && <div className="Notice__title">{title}</div>}

      <div className="Notice__content">{children}</div>
    </div>
  );
}

export default Notice;

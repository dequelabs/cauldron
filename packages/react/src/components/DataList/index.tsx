import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const commonPropTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

interface DataProps {
  children: React.ReactNode;
  className?: string;
}

interface DataListProps extends DataProps {
  collapsed?: boolean;
}

export const DataList = ({
  children,
  className,
  collapsed = false,
  ...other
}: DataListProps) => (
  <dl
    className={classNames('DataList', className, {
      'DataList--collapsed': collapsed
    })}
    {...other}
  >
    {children}
  </dl>
);

DataList.displayName = 'DataList';
DataList.propTypes = commonPropTypes;

export const DataListItem = ({ children, className, ...other }: DataProps) => (
  <div className={classNames('DataList__item', className)} {...other}>
    {children}
  </div>
);

DataListItem.displayName = 'DataListItem';
DataListItem.propTypes = commonPropTypes;

export const DataKey = ({ children, className, ...other }: DataProps) => (
  <dt className={classNames('DataList__item-key', className)} {...other}>
    {children}
  </dt>
);

DataKey.displayName = 'DataKey';
DataKey.propTypes = commonPropTypes;

export const DataValue = ({ children, className, ...other }: DataProps) => (
  <dd className={classNames('DataList__item-value', className)} {...other}>
    {children}
  </dd>
);

DataValue.displayName = 'DataValue';
DataValue.propTypes = commonPropTypes;

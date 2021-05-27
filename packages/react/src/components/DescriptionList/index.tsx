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

interface DescriptionListProps extends DataProps {
  collapsed?: boolean;
}

export const DescriptionList = ({
  children,
  className,
  collapsed = false,
  ...other
}: DescriptionListProps) => (
  <dl
    className={classNames('DescriptionList', className, {
      'DescriptionList--collapsed': collapsed
    })}
    {...other}
  >
    {children}
  </dl>
);

DescriptionList.displayName = 'DescriptionList';
DescriptionList.propTypes = commonPropTypes;

export const DescriptionListItem = ({
  children,
  className,
  ...other
}: DataProps) => (
  <div className={classNames('DescriptionList__item', className)} {...other}>
    {children}
  </div>
);

DescriptionListItem.displayName = 'DescriptionListItem';
DescriptionListItem.propTypes = commonPropTypes;

export const DescriptionTerm = ({
  children,
  className,
  ...other
}: DataProps) => (
  <dt className={classNames('DescriptionList__term', className)} {...other}>
    {children}
  </dt>
);

DescriptionTerm.displayName = 'DescriptionTerm';
DescriptionTerm.propTypes = commonPropTypes;

export const DescriptionDetails = ({
  children,
  className,
  ...other
}: DataProps) => (
  <dd className={classNames('DescriptionList__details', className)} {...other}>
    {children}
  </dd>
);

DescriptionDetails.displayName = 'DescriptionDetails';
DescriptionDetails.propTypes = commonPropTypes;

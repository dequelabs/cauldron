import React from 'react';
import classNames from 'classnames';

interface DescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DescriptionListProps extends DescriptionProps {
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

export const DescriptionListItem = ({
  children,
  className,
  ...other
}: DescriptionProps) => (
  <div className={classNames('DescriptionList__item', className)} {...other}>
    {children}
  </div>
);

DescriptionListItem.displayName = 'DescriptionListItem';

export const DescriptionTerm = ({
  children,
  className,
  ...other
}: DescriptionProps) => (
  <dt className={classNames('DescriptionList__term', className)} {...other}>
    {children}
  </dt>
);

DescriptionTerm.displayName = 'DescriptionTerm';

export const DescriptionDetails = ({
  children,
  className,
  ...other
}: DescriptionProps) => (
  <dd className={classNames('DescriptionList__details', className)} {...other}>
    {children}
  </dd>
);

DescriptionDetails.displayName = 'DescriptionDetails';

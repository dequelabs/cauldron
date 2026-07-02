import React from 'react';
import classNames from 'classnames';

export type MetadataListProps = {
  orientation?: 'vertical' | 'horizontal';
} & React.ComponentPropsWithoutRef<'dl'>;

export function MetadataList({
  orientation = 'horizontal',
  className,
  children,
  ...rest
}: MetadataListProps) {
  return (
    <dl
      className={classNames(
        'MetadataList',
        `MetadataList--${orientation}`,
        className
      )}
      {...rest}
    >
      {children}
    </dl>
  );
}

MetadataList.displayName = 'MetadataList';

export type MetadataListItemProps = React.ComponentPropsWithoutRef<'div'>;

export function MetadataListItem({
  className,
  children,
  ...rest
}: MetadataListItemProps) {
  return (
    <div className={classNames('MetadataList__item', className)} {...rest}>
      {children}
    </div>
  );
}

MetadataListItem.displayName = 'MetadataListItem';

export type MetadataListLabelProps = React.ComponentPropsWithoutRef<'dt'>;

export function MetadataListLabel({
  className,
  children,
  ...rest
}: MetadataListLabelProps) {
  return (
    <dt className={classNames('MetadataList__label', className)} {...rest}>
      {children}
    </dt>
  );
}

MetadataListLabel.displayName = 'MetadataListLabel';

export type MetadataListValueProps = React.ComponentPropsWithoutRef<'dd'>;

export function MetadataListValue({
  className,
  children,
  ...rest
}: MetadataListValueProps) {
  return (
    <dd className={classNames('MetadataList__value', className)} {...rest}>
      {children}
    </dd>
  );
}

MetadataListValue.displayName = 'MetadataListValue';

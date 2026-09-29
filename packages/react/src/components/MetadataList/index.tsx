import React, { forwardRef, type ComponentPropsWithRef } from 'react';
import classNames from 'classnames';

export type MetadataListProps = {
  orientation?: 'vertical' | 'horizontal';
} & ComponentPropsWithRef<'dl'>;

export const MetadataList = forwardRef<HTMLDListElement, MetadataListProps>(
  ({ orientation = 'horizontal', className, children, ...rest }, ref) => {
    return (
      <dl
        className={classNames(
          'MetadataList',
          `MetadataList--${orientation}`,
          className
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </dl>
    );
  }
);

MetadataList.displayName = 'MetadataList';

export type MetadataListItemProps = ComponentPropsWithRef<'div'>;

export const MetadataListItem = forwardRef<
  HTMLDivElement,
  MetadataListItemProps
>(({ className, children, ...rest }, ref) => {
  return (
    <div
      className={classNames('MetadataList__item', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
});

MetadataListItem.displayName = 'MetadataListItem';

export type MetadataListLabelProps = ComponentPropsWithRef<'dt'>;

export const MetadataListLabel = forwardRef<
  HTMLElement,
  MetadataListLabelProps
>(({ className, children, ...rest }, ref) => {
  return (
    <dt
      className={classNames('MetadataList__label', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </dt>
  );
});

MetadataListLabel.displayName = 'MetadataListLabel';

export type MetadataListValueProps = ComponentPropsWithRef<'dd'>;

export const MetadataListValue = forwardRef<
  HTMLElement,
  MetadataListValueProps
>(({ className, children, ...rest }, ref) => {
  return (
    <dd
      className={classNames('MetadataList__value', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </dd>
  );
});

MetadataListValue.displayName = 'MetadataListValue';

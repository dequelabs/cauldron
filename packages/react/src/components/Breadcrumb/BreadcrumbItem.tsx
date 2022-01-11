import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { Cauldron } from '../../types';

interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLSpanElement> {}

const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>(
  ({ className, children, ...props }: BreadcrumbItemProps, ref) => (
    <span
      className={classnames('Breadcrumb__Item', className)}
      ref={ref}
      aria-current="location"
      {...props}
    >
      {children}
    </span>
  )
);

export default BreadcrumbItem;

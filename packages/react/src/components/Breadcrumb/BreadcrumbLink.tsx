import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { Cauldron } from '../../types';

interface BreadcrumbLinkProps extends React.HTMLAttributes<HTMLLinkElement> {
  as?: React.ElementType;
}

const BreadcrumbLink = forwardRef<HTMLElement, BreadcrumbLinkProps>(
  (
    {
      className,
      as: ElementType = 'a',
      children,
      ...props
    }: BreadcrumbLinkProps,
    ref
  ) => (
    <ElementType
      className={classnames('Link', 'Breadcrumb__Link', className)}
      ref={ref}
      {...props}
    >
      {children}
    </ElementType>
  )
);

export default BreadcrumbLink;

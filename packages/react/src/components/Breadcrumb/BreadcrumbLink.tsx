import React, { forwardRef } from 'react';
import classnames from 'classnames';

interface BreadcrumbLinkProps
  extends Omit<React.LinkHTMLAttributes<HTMLLinkElement>, 'as'> {
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

BreadcrumbLink.displayName = 'BreadcrumbLink';
export default BreadcrumbLink;

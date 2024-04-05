import React, { forwardRef } from 'react';
import classnames from 'classnames';
import type {
  PolymorphicProps,
  PolymorphicComponent
} from '../../utils/polymorphicComponent';

type BreadcrumbLinkProps = PolymorphicProps<
  React.AnchorHTMLAttributes<HTMLLinkElement>
>;

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
) as PolymorphicComponent<BreadcrumbLinkProps>;

BreadcrumbLink.displayName = 'BreadcrumbLink';
export default BreadcrumbLink;

import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { Cauldron } from '../../types';

type BreadcrumbProps = {
  separator?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement> &
  Cauldron.LabelProps;

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    { separator = '/', className, children, ...props }: BreadcrumbProps,
    ref
  ) => {
    const items = React.Children.toArray(children);
    const childrenWithSeparators: React.ReactNode[] = [];

    items.forEach((child, index) => {
      if (index !== items.length - 1) {
        childrenWithSeparators.push(
          <>
            {child}
            <span className="Breadcrumb__Separator" aria-hidden="true">
              {separator}
            </span>
          </>
        );
      } else {
        childrenWithSeparators.push(child);
      }
    });

    return (
      <nav className={classnames('Breadcrumb', className)} ref={ref} {...props}>
        <ol>
          {childrenWithSeparators.map((child, index) => (
            <li className="Breadcrumb__Item" key={`breadcrumb-${index}`}>
              {child}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;

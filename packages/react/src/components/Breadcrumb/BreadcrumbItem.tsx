import React, { forwardRef } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

type BreadcrumbItemProps = React.HTMLAttributes<HTMLSpanElement>;

const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>( // eslint-disable-line react/display-name
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
BreadcrumbItem.propTypes = {
  className: PropTypes.string
};
export default BreadcrumbItem;

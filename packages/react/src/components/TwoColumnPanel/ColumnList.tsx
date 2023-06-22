import React, { forwardRef } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

type ColumnListProps = React.HTMLAttributes<HTMLDivElement>;

const ColumnList = forwardRef<HTMLDivElement, ColumnListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={classnames('TwoColumnPanel__List', className)}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

ColumnList.displayName = 'ColumnList';
ColumnList.propTypes = {
  className: PropTypes.string
};
export default ColumnList;

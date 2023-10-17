import React, { forwardRef } from 'react';
import classnames from 'classnames';

type ColumnListProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

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
export default ColumnList;

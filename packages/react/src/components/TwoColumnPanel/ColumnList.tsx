import React, { forwardRef } from 'react';
import classnames from 'classnames';

interface ColumnListProps extends React.HTMLAttributes<HTMLDivElement> {}

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

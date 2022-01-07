import React, { forwardRef } from 'react';
import classnames from 'classnames';

interface ColumnLeftProps extends React.HTMLAttributes<HTMLDivElement> {}

const ColumnLeft = forwardRef<HTMLDivElement, ColumnLeftProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={classnames('TwoColumnPanel__Left', className)}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

ColumnLeft.displayName = 'ColumnLeft';

export default ColumnLeft;

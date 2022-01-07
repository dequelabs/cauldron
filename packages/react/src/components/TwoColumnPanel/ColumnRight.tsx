import React, { forwardRef } from 'react';
import classnames from 'classnames';

interface ColumnRightProps extends React.HTMLAttributes<HTMLDivElement> {}

const ColumnLeft = forwardRef<HTMLDivElement, ColumnRightProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={classnames('TwoColumnPanel__Right', className)}
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

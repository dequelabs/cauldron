import React, { forwardRef } from 'react';
import classnames from 'classnames';

interface ColumnGroupHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const ColumnGroupHeader = forwardRef<HTMLDivElement, ColumnGroupHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={classnames('TwoColumnPanel__GroupHeader', className)}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

ColumnGroupHeader.displayName = 'ColumnGroupHeader';

export default ColumnGroupHeader;

import React, { forwardRef } from 'react';
import classnames from 'classnames';

type ColumnGroupHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

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

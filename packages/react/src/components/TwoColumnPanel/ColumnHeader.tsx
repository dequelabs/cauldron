import React, { forwardRef } from 'react';
import classnames from 'classnames';

type ColumnHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const ColumnHeader = forwardRef<HTMLDivElement, ColumnHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={classnames('TwoColumnPanel__Header', className)}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

ColumnHeader.displayName = 'ColumnHeader';

export default ColumnHeader;

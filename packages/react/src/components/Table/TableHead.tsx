import React, { forwardRef } from 'react';
import classNames from 'classnames';

type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  className?: string;
};

const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ children, className, ...other }, ref) => (
    <thead ref={ref} className={classNames('TableHead', className)} {...other}>
      {children}
    </thead>
  )
);

TableHead.displayName = 'TableHead';

export default TableHead;

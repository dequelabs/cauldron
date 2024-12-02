import React, { forwardRef } from 'react';
import classNames from 'classnames';

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  className?: string;
};

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...other }, ref) => (
    <tbody ref={ref} className={classNames('TableBody', className)} {...other}>
      {children}
    </tbody>
  )
);

TableBody.displayName = 'TableBody';

export default TableBody;

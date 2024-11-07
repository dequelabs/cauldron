import React, { forwardRef } from 'react';
import classNames from 'classnames';

type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  className?: string;
};

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ children, className, ...other }, ref) => (
    <tfoot
      ref={ref}
      className={classNames('TableFooter', className)}
      {...other}
    >
      {children}
    </tfoot>
  )
);

TableFooter.displayName = 'TableFooter';

export default TableFooter;

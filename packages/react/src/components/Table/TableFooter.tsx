import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

const TableFooter = ({
  children,
  className,
  ...other
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot className={classNames('TableFooter', className)} {...other}>
    {children}
  </tfoot>
);

TableFooter.displayName = 'TableFooter';

export default TableFooter;

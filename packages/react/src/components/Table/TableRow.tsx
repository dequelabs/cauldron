import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

const TableRow = ({
  children,
  className,
  ...other
}: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={classNames('TableRow', className)} {...other}>
    {children}
  </tr>
);

TableRow.displayName = 'TableRow';

export default TableRow;

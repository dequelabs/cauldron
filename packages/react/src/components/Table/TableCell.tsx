import React, { TdHTMLAttributes } from 'react';
import classNames from 'classnames';

const TableCell = ({
  children,
  className,
  ...other
}: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={classNames('TableCell', className)} {...other}>
    {children}
  </td>
);

TableCell.displayName = 'TableCell';

export default TableCell;

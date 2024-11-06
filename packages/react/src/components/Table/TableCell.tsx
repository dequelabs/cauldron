import type { ColumnAlignment } from './Table';
import React, { TdHTMLAttributes, useRef } from 'react';
import classNames from 'classnames';
import { useTable } from './TableContext';
import useTableGridStyles from './useTableGridStyles';

interface TableCellProps
  extends Omit<TdHTMLAttributes<HTMLTableDataCellElement>, 'align'> {
  align?: ColumnAlignment;
}

const TableCell = ({
  children,
  className,
  align,
  style,
  ...other
}: TableCellProps) => {
  const tableCellRef = useRef<HTMLTableDataCellElement>(null);
  const { layout, columns } = useTable();
  const tableGridStyles = useTableGridStyles({
    elementRef: tableCellRef,
    align,
    columns,
    layout
  });

  return (
    <td
      ref={tableCellRef}
      style={{ ...tableGridStyles, ...style }}
      className={classNames('TableCell', className)}
      {...other}
    >
      {children}
    </td>
  );
};

TableCell.displayName = 'TableCell';

export default TableCell;

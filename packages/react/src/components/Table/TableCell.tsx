import type { ColumnAlignment } from './Table';
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { useTable } from './TableContext';
import useTableGridStyles from './useTableGridStyles';
import useSharedRef from '../../utils/useSharedRef';

interface TableCellProps
  extends Omit<React.TdHTMLAttributes<HTMLTableDataCellElement>, 'align'> {
  align?: ColumnAlignment;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className, align, style, ...other }, ref) => {
    const tableCellRef = useSharedRef<HTMLTableCellElement>(ref);
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
  }
);

TableCell.displayName = 'TableCell';

export default TableCell;

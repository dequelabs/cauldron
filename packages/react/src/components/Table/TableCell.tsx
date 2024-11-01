import React, { TdHTMLAttributes, useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useTableLayout } from './TableContext';
import { ColumnAlignment } from './Table';

const TableCell = ({
  children,
  className,
  ...other
}: TdHTMLAttributes<HTMLTableDataCellElement>) => {
  const [alignment, setAlignment] = useState<ColumnAlignment>();
  const { columns } = useTableLayout();
  const cellRef = useRef<HTMLTableDataCellElement>(null);

  useEffect(() => {
    if (!columns.length) {
      return;
    }

    // get the index of this cell
    const element = cellRef.current!;
    // lazy, do boundary checking + colspan stuffs
    const column = columns[element.cellIndex];
    setAlignment(column?.align || 'start');
  }, [setAlignment, columns]);

  return (
    <td
      ref={cellRef}
      style={{ textAlign: alignment }}
      className={classNames('TableCell', className)}
      {...other}
    >
      {children}
    </td>
  );
};

TableCell.displayName = 'TableCell';

export default TableCell;

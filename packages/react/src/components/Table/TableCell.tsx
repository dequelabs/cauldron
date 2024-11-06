import type { ColumnAlignment } from './Table';
import React, { TdHTMLAttributes, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { useTable } from './TableContext';

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
  const isGridLayout = layout === 'grid';

  const [columnAlignment, setColumnAlignment] = useState<ColumnAlignment>(
    align || 'start'
  );
  const [gridColumnSpan, setGridColumnSpan] = useState<number>(1);
  useEffect(() => {
    if (!isGridLayout) {
      return;
    }

    const element = tableCellRef.current;
    const column =
      typeof columns !== 'number' && columns[element?.cellIndex ?? -1];

    if (!column) {
      setColumnAlignment(align || 'start');
    } else {
      setColumnAlignment(column.align);
    }

    if (element?.colSpan) {
      setGridColumnSpan(element.colSpan);
    } else {
      setGridColumnSpan(1);
    }
  }, [isGridLayout, columns, align]);

  const gridStyles: React.CSSProperties = isGridLayout
    ? {
        textAlign: columnAlignment,
        gridColumn: `span ${gridColumnSpan}`
      }
    : {};

  return (
    <td
      ref={tableCellRef}
      style={{ ...gridStyles, ...style }}
      className={classNames('TableCell', className)}
      {...other}
    >
      {children}
    </td>
  );
};

TableCell.displayName = 'TableCell';

export default TableCell;

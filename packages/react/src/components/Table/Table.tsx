import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { TableProvider } from './TableContext';

export type Column = {
  align: ColumnAlignment;
  width: ColumnWidth;
};
export type ColumnAlignment = 'start' | 'center' | 'end';
export type ColumnWidth =
  | 'auto'
  | 'min-content'
  | 'max-content'
  | `${number}`
  | `${number}%`
  | `${number}fr`;
export type RowAlignment = 'start' | 'center';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: 'border';
}

const Table = ({ children, className, variant, ...other }: TableProps) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const styleTemplateColumns = useMemo(() => {
    if (!columns) {
      return 'auto';
    }

    return columns
      .map(({ width }) => {
        if (!width) {
          return 'auto';
        } else {
          return width;
        }
      })
      .join(' ');
  }, [columns]);

  return (
    <table
      style={{
        // @ts-ignore
        '--table-grid-template-columns': styleTemplateColumns
      }}
      className={classNames(
        'Table',
        variant === 'border' && 'Table--border',
        className
      )}
      {...other}
    >
      <TableProvider columns={columns} setColumns={setColumns}>
        {children}
      </TableProvider>
    </table>
  );
};

Table.displayName = 'Table';

export default Table;

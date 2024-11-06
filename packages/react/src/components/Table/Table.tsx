import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { TableProvider } from './TableContext';

export type Column = {
  align: ColumnAlignment;
  width?: ColumnWidth;
  minWidth?: `${number}` | `${number}%`;
  maxWidth?: `${number}` | `${number}%`;
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
  layout: never;
  columns: never;
  variant?: 'border';
}

interface TableGridProps extends Omit<TableProps, 'layout' | 'columns'> {
  layout: 'grid';
  columns?: Array<Column> | number;
}

const Table = ({
  children,
  className,
  variant,
  layout,
  columns: columnsProp = [],
  style,
  ...other
}: TableProps | TableGridProps) => {
  const isGridLayout = layout === 'grid';
  const columns: Column[] = useMemo(() => {
    if (typeof columnsProp === 'number') {
      return columnsProp > 0
        ? Array(columnsProp).fill({ align: 'start' })
        : [{ align: 'start' }];
    }

    return columnsProp;
  }, [columnsProp]);

  const styleTemplateColumns = useMemo(() => {
    if (layout !== 'grid') {
      return;
    }

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
  }, [layout, columns]);

  const tableGridStyles: React.CSSProperties = isGridLayout
    ? ({
        '--table-grid-template-columns': styleTemplateColumns
      } as React.CSSProperties)
    : {};

  return (
    <table
      style={{
        ...tableGridStyles,
        ...style
      }}
      className={classNames('Table', className, {
        'Table--border': variant === 'border',
        TableGrid: isGridLayout
      })}
      {...other}
    >
      <TableProvider layout={isGridLayout ? 'grid' : 'table'} columns={columns}>
        {children}
      </TableProvider>
    </table>
  );
};

Table.displayName = 'Table';

export default Table;

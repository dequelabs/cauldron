import React, { useMemo } from 'react';
import classNames from 'classnames';
import { TableProvider } from './TableContext';

export type Column = {
  align: ColumnAlignment;
  width?: ColumnWidth;
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

type TableBaseProps = {
  layout: never;
  columns: never;
  variant?: 'border';
};

type TableGridProps = {
  layout: 'grid';
  columns?: Array<Column> | number;
  variant?: 'border';
};

type TableProps = (TableBaseProps | Partial<TableGridProps>) &
  React.TableHTMLAttributes<HTMLTableElement>;

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      children,
      className,
      variant,
      layout,
      columns: columnsProp = [],
      style,
      ...other
    },
    ref
  ) => {
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
        ref={ref}
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
        <TableProvider
          layout={isGridLayout ? 'grid' : 'table'}
          columns={columns}
        >
          {children}
        </TableProvider>
      </table>
    );
  }
);

Table.displayName = 'Table';

export default Table;

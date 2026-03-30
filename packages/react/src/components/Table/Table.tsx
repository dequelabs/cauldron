import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Offscreen from '../Offscreen';
import { TableProvider, useSortAnnouncementState } from './TableContext';

export type Column = {
  align: ColumnAlignment;
  width?: ColumnWidth;
  maxWidth?: ColumnWidth;
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

function parseColumnWidth(width?: ColumnWidth): string {
  const number = Number(width);
  if (!isNaN(number)) {
    return `${number}px`;
  }

  if (!width) {
    return 'auto';
  }

  return width;
}

function SortAnnouncementPortal(): JSX.Element | null {
  const { text } = useSortAnnouncementState();
  if (typeof document === 'undefined') {
    return null;
  }
  return createPortal(
    <Offscreen>
      <span role="status">{text}</span>
    </Offscreen>,
    // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
    document.body
  ) as React.ReactPortal;
}

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
        .map(({ width, maxWidth }) => {
          if (maxWidth) {
            return `minmax(${parseColumnWidth(width)}, ${parseColumnWidth(
              maxWidth
            )})`;
          }

          return parseColumnWidth(width);
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
          <SortAnnouncementPortal />
        </TableProvider>
      </table>
    );
  }
);

Table.displayName = 'Table';

export default Table;

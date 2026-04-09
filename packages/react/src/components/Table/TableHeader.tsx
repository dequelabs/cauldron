import type { ColumnAlignment } from './Table';
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { useTable } from './TableContext';
import useTableGridStyles from './useTableGridStyles';
import useSharedRef from '../../utils/useSharedRef';

// these match aria-sort's values
type SortDirection = 'ascending' | 'descending' | 'none';

interface TableHeaderProps extends Omit<
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
  'align'
> {
  sortDirection?: SortDirection;
  onSort?: () => void;
  /** @deprecated No longer used. Sort state is communicated via aria-sort. */
  sortAscendingAnnouncement?: string;
  /** @deprecated No longer used. Sort state is communicated via aria-sort. */
  sortDescendingAnnouncement?: string;
  align?: ColumnAlignment;
  /* Only applies a visual style to the header, does not change semantics */
  variant?: 'header' | 'cell';
}

const TableHeader = forwardRef<HTMLTableHeaderCellElement, TableHeaderProps>(
  (
    {
      children,
      sortDirection,
      onSort,
      className,
      sortAscendingAnnouncement: _sortAscendingAnnouncement,
      sortDescendingAnnouncement: _sortDescendingAnnouncement,
      align,
      variant = 'header',
      style,
      ...other
    },
    ref
  ) => {
    const tableHeaderRef = useSharedRef<HTMLTableHeaderCellElement>(ref);
    const { layout, columns } = useTable();
    const tableGridStyles = useTableGridStyles({
      elementRef: tableHeaderRef,
      align,
      columns,
      layout
    });

    // Sort state is communicated via the aria-sort attribute on <th>.
    // A live region (Offscreen) was previously used as a workaround for
    // limited aria-sort support, but it was removed because screen readers
    // (e.g. NVDA) included the announcement text in the column header's
    // accessible name, causing it to be read for every cell in the column.

    return (
      <th
        ref={tableHeaderRef}
        aria-sort={sortDirection}
        className={classNames(
          variant === 'cell'
            ? ['TableCell', 'TableHeader--cell-variant']
            : 'TableHeader',
          className,
          {
            'TableHeader--sort-ascending': sortDirection === 'ascending',
            'TableHeader--sort-descending': sortDirection === 'descending'
          }
        )}
        style={{ ...tableGridStyles, ...style }}
        {...other}
      >
        {!!onSort && !!sortDirection ? (
          <button
            onClick={onSort}
            className="TableHeader__sort-button"
            type="button"
          >
            {children}
            <span aria-hidden="true">
              {sortDirection === 'none' ? (
                <Icon type="sort-triangle" />
              ) : sortDirection === 'ascending' ? (
                <Icon type="table-sort-ascending" />
              ) : (
                <Icon type="table-sort-descending" />
              )}
            </span>
          </button>
        ) : (
          children
        )}
      </th>
    );
  }
);

TableHeader.displayName = 'TableHeader';

export default TableHeader;

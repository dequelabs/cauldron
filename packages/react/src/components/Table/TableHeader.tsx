import type { ColumnAlignment } from './Table';
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Offscreen from '../Offscreen';
import Icon from '../Icon';
import { useTable } from './TableContext';
import useTableGridStyles from './useTableGridStyles';
import useSharedRef from '../../utils/useSharedRef';

// these match aria-sort's values
type SortDirection = 'ascending' | 'descending' | 'none';

interface TableHeaderProps
  extends Omit<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, 'align'> {
  sortDirection?: SortDirection;
  onSort?: () => void;
  sortAscendingAnnouncement?: string;
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
      sortAscendingAnnouncement = 'sorted ascending',
      sortDescendingAnnouncement = 'sorted descending',
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

    // When the sort direction changes, we want to announce the change in a live region
    // because changes to the sort value is not widely supported yet
    // see: https://a11ysupport.io/tech/aria/aria-sort_attribute
    const announcement =
      sortDirection === 'ascending'
        ? sortAscendingAnnouncement
        : sortDirection === 'descending'
          ? sortDescendingAnnouncement
          : '';

    return (
      <th
        ref={tableHeaderRef}
        aria-sort={sortDirection}
        className={classNames(
          variant === 'cell'
            ? ['TableCell', 'TableHeader--CellVariant']
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
            <Offscreen>
              <span role="status" aria-live="polite">
                {announcement}
              </span>
            </Offscreen>
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

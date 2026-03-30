import type { ColumnAlignment } from './Table';
import React, { forwardRef, useEffect, useRef } from 'react';
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
  sortAscendingAnnouncement?: string;
  sortDescendingAnnouncement?: string;
  align?: ColumnAlignment;
  /* Only applies a visual style to the header, does not change semantics */
  variant?: 'header' | 'cell';
}

/**
 * Manages a live region in the document body so the sort announcement is not
 * part of the column header's accessible name. Without this, screen readers
 * repeat the sort state text on every data cell in the sorted column.
 */
const useSortAnnouncement = (announcement: string) => {
  const liveRegionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.createElement('div');
    container.className = 'Offscreen';
    const liveRegion = document.createElement('span');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    container.appendChild(liveRegion);
    document.body.appendChild(container);
    liveRegionRef.current = liveRegion;

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  useEffect(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = announcement;
    }
  }, [announcement]);
};

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

    useSortAnnouncement(announcement);

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

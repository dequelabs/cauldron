import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import Offscreen from '../Offscreen';
import Icon from '../Icon';
import type { ColumnAlignment, ColumnWidth } from './Table';
import { useTableLayout } from './TableContext';

// these match aria-sort's values
type SortDirection = 'ascending' | 'descending' | 'none';

interface TableHeaderProps
  extends Omit<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, 'align'> {
  sortDirection?: SortDirection;
  onSort?: () => void;
  sortAscendingAnnouncement?: string;
  sortDescendingAnnouncement?: string;
  align: ColumnAlignment;
  width: ColumnWidth;
}

const TableHeader = ({
  children,
  sortDirection,
  onSort,
  className,
  sortAscendingAnnouncement = 'sorted ascending',
  sortDescendingAnnouncement = 'sorted descending',
  align,
  width,
  ...other
}: TableHeaderProps) => {
  // When the sort direction changes, we want to announce the change in a live region
  // because changes to the sort value is not widely supported yet
  // see: https://a11ysupport.io/tech/aria/aria-sort_attribute
  const announcement =
    sortDirection === 'ascending'
      ? sortAscendingAnnouncement
      : sortDirection === 'descending'
      ? sortDescendingAnnouncement
      : '';

  const headerRef = useRef<HTMLTableHeaderCellElement>(null);
  const { columns, registerColumn, unregisterColumn } = useTableLayout();

  useEffect(() => {
    const headerElement = headerRef.current!;
    const row = headerElement.closest('tr');
    if (!row || headerElement.getAttribute('scope') !== 'col') {
      return;
    }

    // NOTE: We should determine the column order here
    registerColumn(headerElement, { align, width });

    return () => {
      console.log('unregister');
      unregisterColumn(headerElement);
    };
  }, [registerColumn, unregisterColumn]);

  return (
    <th
      ref={headerRef}
      aria-sort={sortDirection}
      className={classNames('TableHeader', className, {
        'TableHeader--sort-ascending': sortDirection === 'ascending',
        'TableHeader--sort-descending': sortDirection === 'descending'
      })}
      style={{ textAlign: align }}
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
};

TableHeader.displayName = 'TableHeader';

export default TableHeader;

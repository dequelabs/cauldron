import React, { ThHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Offscreen from '../Offscreen';
import Icon from '../Icon';

// these match aria-sort's values
type SortDirection = 'ascending' | 'descending' | 'none';

const variants = ['cell'] as const;
type Variant = typeof variants[number];

interface TableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortDirection?: SortDirection;
  onSort?: () => void;
  className?: string;
  sortAscendingAnnouncement?: string;
  sortDescendingAnnouncement?: string;
  variant?: Variant;
}

const TableHeader = ({
  children,
  sortDirection,
  onSort,
  className,
  sortAscendingAnnouncement = 'sorted ascending',
  sortDescendingAnnouncement = 'sorted descending',
  variant,
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

  return (
    <th
      aria-sort={sortDirection}
      className={classNames('TableHeader', className, {
        'TableHeader--sort-ascending': sortDirection === 'ascending',
        'TableHeader--sort-descending': sortDirection === 'descending',
        TableCell: variant === 'cell'
      })}
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
              <Icon type="triangle-up" />
            ) : (
              <Icon type="triangle-down" />
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
TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
  sortDirection: PropTypes.string,
  onSort: PropTypes.func,
  className: PropTypes.string,
  sortAscendingAnnouncement: PropTypes.string,
  sortDescendingAnnouncement: PropTypes.string,
  variant: PropTypes.oneOf(variants)
};

export default TableHeader;

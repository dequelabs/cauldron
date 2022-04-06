import React, { ThHTMLAttributes, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Offscreen from '../Offscreen';
import Icon from '../Icon';

// these match aria-sort's values
type SortDirection = 'ascending' | 'descending' | 'none';

interface TableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortDirection?: SortDirection;
  onSort?: () => void;
  className?: string;
  sortAscendingAnnouncement?: string;
  sortDescendingAnnouncemen?: string;
}

const TableHeader = ({
  children,
  sortDirection,
  onSort,
  className,
  sortAscendingAnnouncement = 'sorted ascending',
  sortDescendingAnnouncemen = 'sorted descending',
  ...other
}: TableHeaderProps) => {
  // When the sort direction changes, we want to announce the change in a live region
  // because changes to the sort value is not widely supported yet
  // see: https://a11ysupport.io/tech/aria/aria-sort_attribute
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    if (sortDirection !== 'none') {
      setAnnouncement(
        sortDirection === 'ascending'
          ? sortAscendingAnnouncement
          : sortDescendingAnnouncemen
      );
    }
  }, [sortDirection]);
  return (
    <th
      aria-sort={sortDirection}
      className={classNames('TableHeader', className, {
        'TableHeader--sort-ascending': sortDirection === 'ascending',
        'TableHeader--sort-descending': sortDirection === 'descending'
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
  className: PropTypes.string
};

export default TableHeader;

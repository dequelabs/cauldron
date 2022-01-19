import React, { ThHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

// these match aria-sort's values
type SortDirection = 'ascending' | 'descending' | 'none';

interface TableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortDirection?: SortDirection;
  onSort?: () => void;
  className?: string;
}

const TableHeader = ({
  children,
  sortDirection,
  onSort,
  className,
  ...other
}: TableHeaderProps) => (
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
      </button>
    ) : (
      children
    )}
  </th>
);

TableHeader.displayName = 'TableHeader';
TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
  sortDirection: PropTypes.string,
  onSort: PropTypes.func,
  className: PropTypes.string
};

export default TableHeader;

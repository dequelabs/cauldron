import React, { useRef, useEffect, ThHTMLAttributes } from 'react';
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
}: TableHeaderProps) => {
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!sortDirection || sortDirection === 'none') {
      return;
    }
    sortButtonRef.current?.focus();
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
      {onSort && sortDirection ? (
        <button
          ref={sortButtonRef}
          onClick={onSort}
          className="TableHeader__sort-button"
          type="button"
        >
          {children}
          <span aria-hidden="true">
            {['none', 'ascending'].includes(sortDirection) && (
              <Icon type="triangle-up" />
            )}
            {['none', 'descending'].includes(sortDirection) && (
              <Icon type="triangle-down" />
            )}
          </span>
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

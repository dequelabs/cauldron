import React, { ThHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

// these match aria-sort's values
type SortDirection = 'ascending' | 'descending' | 'none';

interface TableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortDir?: SortDirection;
  onSort?: () => void;
  className?: string;
}

const TableHeader = ({
  children,
  sortDir,
  onSort,
  className,
  ...other
}: TableHeaderProps) => (
  <th
    aria-sort={sortDir}
    className={classNames('TableHeader', className)}
    {...other}
  >
    {onSort && sortDir ? (
      <button onClick={onSort}>
        {children}
        {['none', 'ascending'].includes(sortDir) && <Icon type="triangle-up" />}
        {['none', 'descending'].includes(sortDir) && (
          <Icon type="triangle-down" />
        )}
      </button>
    ) : (
      children
    )}
  </th>
);

TableHeader.displayName = 'TableHeader';
TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
  sortDir: PropTypes.string,
  onSort: PropTypes.func,
  className: PropTypes.string
};

export default TableHeader;

import React, { TdHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
}

const TableCell = ({ children, className, ...other }: TableCellProps) => (
  <td className={classNames('TableCell', className)} {...other}>
    {children}
  </td>
);

TableCell.displayName = 'TableCell';
TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default TableCell;

import React, { ThHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
}

const TableHeader = ({ children, className, ...other }: TableHeaderProps) => (
  <th className={classNames('TableHeader', className)} {...other}>
    {children}
  </th>
);

TableHeader.displayName = 'TableHeader';
TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default TableHeader;

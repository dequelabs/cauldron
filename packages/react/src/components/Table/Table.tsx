import React, { TableHTMLAttributes } from 'react';
import classNames from 'classnames';

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  variant?: 'border';
}

const Table = ({ children, className, variant, ...other }: TableProps) => (
  <table
    className={classNames(
      'Table',
      variant === 'border' && 'Table--border',
      className
    )}
    {...other}
  >
    {children}
  </table>
);

Table.displayName = 'Table';

export default Table;

import React, { TableHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
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
Table.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.string
};

export default Table;

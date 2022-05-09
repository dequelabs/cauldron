import React, { TableHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Table = ({
  children,
  className,
  ...other
}: TableHTMLAttributes<HTMLTableElement>) => (
  <table className={classNames('Table', className)} {...other}>
    {children}
  </table>
);

Table.displayName = 'Table';
Table.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Table;

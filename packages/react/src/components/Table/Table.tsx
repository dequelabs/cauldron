import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const Table = ({ children, className, ...other }: TableProps) => (
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

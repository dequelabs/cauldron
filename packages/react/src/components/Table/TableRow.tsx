import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

const TableRow = ({ children, className, ...other }: TableRowProps) => (
  <tr className={classNames('TableRow', className)} {...other}>
    {children}
  </tr>
);

TableRow.displayName = 'TableRow';
TableRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default TableRow;

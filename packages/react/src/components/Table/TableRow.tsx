import React, { HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TableRow = ({
  children,
  className,
  ...other
}: HTMLAttributes<HTMLTableRowElement>) => (
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

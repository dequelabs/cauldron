import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

const TableBody = ({ children, className, ...other }: TableBodyProps) => (
  <tbody className={classNames('TableBody', className)} {...other}>
    {children}
  </tbody>
);

TableBody.displayName = 'TableBody';
TableBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default TableBody;

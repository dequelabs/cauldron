import React, { HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TableBody = ({
  children,
  className,
  ...other
}: HTMLAttributes<HTMLTableSectionElement>) => (
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

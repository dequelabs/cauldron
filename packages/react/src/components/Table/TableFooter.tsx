import React, { HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TableFooter = ({
  children,
  className,
  ...other
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot className={classNames('TableFooter', className)} {...other}>
    {children}
  </tfoot>
);

TableFooter.displayName = 'TableFooter';
TableFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default TableFooter;

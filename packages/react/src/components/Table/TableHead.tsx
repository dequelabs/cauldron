import React, { HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TableHead = ({
  children,
  className,
  ...other
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={classNames('TableHead', className)} {...other}>
    {children}
  </thead>
);

TableHead.displayName = 'TableHead';
TableHead.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default TableHead;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

const TableHead = ({ children, className, ...other }: TableHeadProps) => (
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

import React, { HTMLAttributes } from 'react';
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

export default TableHead;

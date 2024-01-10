import React, { HTMLAttributes } from 'react';
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

export default TableBody;

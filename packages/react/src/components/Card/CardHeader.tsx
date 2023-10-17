import React from 'react';
import classNames from 'classnames';

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeader = ({ className, ...other }: CardHeaderProps) => (
  <div className={classNames('Card__header', className)} {...other} />
);

CardHeader.displayName = 'CardHeader';

export default CardHeader;

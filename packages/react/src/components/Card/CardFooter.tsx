import React from 'react';
import classNames from 'classnames';

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const CardFooter = ({ className, ...other }: CardFooterProps) => (
  <div className={classNames('Card__footer', className)} {...other} />
);

CardFooter.displayName = 'CardFooter';

export default CardFooter;

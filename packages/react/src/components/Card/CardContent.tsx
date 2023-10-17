import React from 'react';
import classNames from 'classnames';

export type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

const CardContent = ({ className, ...other }: CardContentProps) => (
  <div className={classNames('Card__content', className)} {...other} />
);

CardContent.displayName = 'CardContent';

export default CardContent;

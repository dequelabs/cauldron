import React from 'react';
import classNames from 'classnames';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'simple';
}

const Card = ({ className, variant, ...other }: CardProps) => (
  <div
    className={classNames(className, {
      'Card--simple': variant === 'simple',
      Card: !variant
    })}
    {...other}
  />
);

Card.displayName = 'Card';

export default Card;

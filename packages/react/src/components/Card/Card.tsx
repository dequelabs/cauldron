import React from 'react';
import PropTypes from 'prop-types';
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
Card.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string
};

export default Card;

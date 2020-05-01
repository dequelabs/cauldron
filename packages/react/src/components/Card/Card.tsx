import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = ({ className, ...other }: CardProps) => (
  <div className={classNames('dqpl-tile', className)} {...other} />
);

Card.displayName = 'Card';
Card.propTypes = {
  className: PropTypes.string
};

export default Card;

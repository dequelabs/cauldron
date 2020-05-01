import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = ({ className, ...other }: CardFooterProps) => (
  <div className={classNames('dqpl-tile-footer', className)} {...other} />
);

CardFooter.displayName = 'CardFooter';
CardFooter.propTypes = {
  className: PropTypes.string
};

export default CardFooter;

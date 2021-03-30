import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = ({ className, ...other }: CardContentProps) => (
  <div className={classNames('Card__content', className)} {...other} />
);

CardContent.displayName = 'CardContent';
CardContent.propTypes = {
  className: PropTypes.string
};

export default CardContent;

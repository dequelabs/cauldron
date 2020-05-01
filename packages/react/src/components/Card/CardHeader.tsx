import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = ({ className, ...other }: CardHeaderProps) => (
  <div className={classNames('dqpl-tile-header', className)} {...other} />
);

CardHeader.displayName = 'CardHeader';
CardHeader.propTypes = {
  className: PropTypes.string
};

export default CardHeader;

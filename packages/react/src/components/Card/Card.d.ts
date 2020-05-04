import React from 'react';
import PropTypes from 'prop-types';
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
declare const Card: {
  ({ className, ...other }: CardProps): JSX.Element;
  displayName: string;
  propTypes: {
    className: PropTypes.Requireable<string>;
  };
};
export default Card;

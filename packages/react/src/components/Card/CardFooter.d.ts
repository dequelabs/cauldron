import React from 'react';
import PropTypes from 'prop-types';
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
declare const CardFooter: {
  ({ className, ...other }: CardFooterProps): JSX.Element;
  displayName: string;
  propTypes: {
    className: PropTypes.Requireable<string>;
  };
};
export default CardFooter;

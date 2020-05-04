import React from 'react';
import PropTypes from 'prop-types';
export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}
declare const CardContent: {
  ({ className, ...other }: CardContentProps): JSX.Element;
  displayName: string;
  propTypes: {
    className: PropTypes.Requireable<string>;
  };
};
export default CardContent;

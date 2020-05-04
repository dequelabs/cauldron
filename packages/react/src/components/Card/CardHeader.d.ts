import React from 'react';
import PropTypes from 'prop-types';
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
declare const CardHeader: {
  ({ className, ...other }: CardHeaderProps): JSX.Element;
  displayName: string;
  propTypes: {
    className: PropTypes.Requireable<string>;
  };
};
export default CardHeader;

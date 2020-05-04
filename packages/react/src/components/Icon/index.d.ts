import React from 'react';
import PropTypes from 'prop-types';
export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  type: string;
}
declare const Icon: {
  ({ label, type, className, ...other }: IconProps): JSX.Element;
  propTypes: {
    label: PropTypes.Requireable<string>;
    className: PropTypes.Requireable<string>;
    type: PropTypes.Validator<string>;
  };
};
export default Icon;

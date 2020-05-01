import React from 'react';
import PropTypes from 'prop-types';
export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
}
declare function Loader({
  label,
  className,
  ...other
}: LoaderProps): JSX.Element;
declare namespace Loader {
  var propTypes: {
    label: PropTypes.Requireable<string>;
    className: PropTypes.Requireable<string>;
  };
  var displayName: string;
}
export default Loader;

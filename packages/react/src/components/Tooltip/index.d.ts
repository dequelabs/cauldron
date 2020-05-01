import React from 'react';
import PropTypes from 'prop-types';
export interface TooltipProps {
  placement: string;
  children: React.ReactNode;
  overlay: React.ReactNode;
  id: string;
}
declare function Tooltip({
  placement,
  children,
  overlay,
  id
}: TooltipProps): JSX.Element;
declare namespace Tooltip {
  var propTypes: {
    children: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    overlay: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    id: PropTypes.Validator<string>;
    placement: PropTypes.Requireable<string>;
  };
  var defaultProps: {
    placement: string;
  };
}
export default Tooltip;

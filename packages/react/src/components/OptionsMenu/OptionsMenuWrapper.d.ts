import React from 'react';
import PropTypes from 'prop-types';
import { OptionsMenuAlignmentProps } from './OptionsMenu';
export interface OptionsMenuWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    OptionsMenuAlignmentProps {}
/**
 * Wrapper / parent component for the <OptionsMenuTrigger /> and <OptionsMenu /> components
 */
declare const OptionsMenuWrapper: {
  ({ className, align, ...other }: OptionsMenuWrapperProps): JSX.Element;
  propTypes: {
    children: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    className: PropTypes.Requireable<string>;
    align: PropTypes.Requireable<string>;
  };
};
export default OptionsMenuWrapper;

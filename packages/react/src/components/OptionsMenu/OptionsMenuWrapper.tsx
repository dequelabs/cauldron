import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { OptionsMenuAlignmentProps } from './OptionsMenu';

const menuAlignment = (type: OptionsMenuWrapperProps['align']) => {
  switch (type) {
    case 'left':
      return 'OptionsMenu--align-left';
    case 'right':
      return 'OptionsMenu--align-right';
  }
};

export interface OptionsMenuWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    OptionsMenuAlignmentProps {}

/**
 * Wrapper / parent component for the <OptionsMenuTrigger /> and <OptionsMenu /> components
 */
const OptionsMenuWrapper = ({
  className,
  align,
  ...other
}: OptionsMenuWrapperProps) => (
  <div
    className={classNames('OptionsMenu', menuAlignment(align), className)}
    {...other}
  />
);

OptionsMenuWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right'])
};

export default OptionsMenuWrapper;

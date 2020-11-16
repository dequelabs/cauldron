import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const LoaderOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...other }, ref) => (
  <div
    className={classNames('Loader__overlay', className)}
    ref={ref}
    {...other}
  />
));

LoaderOverlay.propTypes = {
  className: PropTypes.string
};

LoaderOverlay.displayName = 'LoaderOverlay';

export default LoaderOverlay;

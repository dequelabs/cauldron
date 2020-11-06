import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const LoaderScrim = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...other }, ref) => (
  <div
    className={classNames('Loader__scrim', className)}
    ref={ref}
    {...other}
  />
));

LoaderScrim.propTypes = {
  className: PropTypes.string
};

LoaderScrim.displayName = 'LoaderScrim';

export default LoaderScrim;

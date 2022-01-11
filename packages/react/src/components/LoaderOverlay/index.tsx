import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Loader from '../Loader';
import AxeLoader from './axe-loader';

interface LoaderOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'large' | 'small';
  label?: string;
}

const LoaderOverlay = React.forwardRef<HTMLDivElement, LoaderOverlayProps>(
  ({ className, variant, label, ...other }: LoaderOverlayProps, ref) => (
    <div
      className={classNames(
        'Loader__overlay',
        className,
        variant === 'large'
          ? 'Loader__overlay--large'
          : variant === 'small'
          ? 'Loader__overlay--small'
          : ''
      )}
      ref={ref}
      {...other}
    >
      <div className="Loader__overlay__loader">
        <Loader variant={variant} />
        <AxeLoader />
      </div>
      {label ? <span className="Loader__overlay__label">{label}</span> : null}
      {other.children}
    </div>
  )
);

LoaderOverlay.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['large', 'small']),
  label: PropTypes.string
};

LoaderOverlay.displayName = 'LoaderOverlay';

export default LoaderOverlay;

import React, { createRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Loader from '../Loader';
import AxeLoader from './axe-loader';

interface LoaderOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'large' | 'small';
  label?: string;
  focusOnInitialRender?: boolean;
  children?: React.ReactNode;
}

const LoaderOverlay = React.forwardRef<HTMLDivElement, LoaderOverlayProps>(
  (
    {
      className,
      variant,
      label,
      children,
      focusOnInitialRender,
      ...other
    }: LoaderOverlayProps,
    ref
  ) => {
    const overlayRef = createRef<HTMLDivElement>();

    useEffect(() => {
      if (!!focusOnInitialRender && overlayRef) {
        setTimeout(() => {
          return overlayRef.current?.focus();
        });
      }
      return;
    }, []);

    return (
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
        ref={ref ? ref : overlayRef}
        tabIndex={-1}
        {...other}
      >
        <div className="Loader__overlay__loader">
          <Loader variant={variant} />
          <AxeLoader />
        </div>
        {label ? <span className="Loader__overlay__label">{label}</span> : null}
        {children}
      </div>
    );
  }
);

LoaderOverlay.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['large', 'small']),
  label: PropTypes.string,
  focusOnInitialRender: PropTypes.bool,
  children: PropTypes.node
};

LoaderOverlay.displayName = 'LoaderOverlay';

export default LoaderOverlay;

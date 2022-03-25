import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Loader from '../Loader';
import AxeLoader from './axe-loader';
import useSharedRef from '../../utils/useSharedRef';

interface LoaderOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'large' | 'small';
  label?: string;
  focusOnInitialRender?: boolean;
  children?: React.ReactNode;
}

const LoaderOverlay = forwardRef<HTMLDivElement, LoaderOverlayProps>(
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
    const overlayRef = useSharedRef<HTMLDivElement>(ref);

    useEffect(() => {
      if (!!focusOnInitialRender && overlayRef.current) {
        setTimeout(() => {
          return overlayRef.current?.focus();
        });
      }
      return;
    }, [overlayRef.current]);

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
        ref={overlayRef}
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

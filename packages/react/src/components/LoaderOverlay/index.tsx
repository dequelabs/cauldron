import React, { forwardRef, useEffect } from 'react';
import FocusTrap from 'focus-trap-react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Loader from '../Loader';
import AxeLoader from './axe-loader';
import AriaIsolate from '../../utils/aria-isolate';
import useSharedRef from '../../utils/useSharedRef';

export interface LoaderOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  focusOnInitialRender?: boolean;
  children?: React.ReactNode;
  focusTrap?: boolean;
}

const LoaderOverlay = forwardRef<HTMLDivElement, LoaderOverlayProps>(
  (
    {
      className,
      label,
      children,
      focusOnInitialRender,
      focusTrap = false,
      ...other
    }: LoaderOverlayProps,
    ref
  ) => {
    const overlayRef = useSharedRef<HTMLDivElement>(ref);

    useEffect(() => {
      const isolator = overlayRef.current
        ? new AriaIsolate(overlayRef.current)
        : null;

      if (isolator) {
        focusTrap ? isolator.activate() : isolator.deactivate();
      }

      return () => {
        isolator?.deactivate();
      };
    }, [focusTrap, overlayRef.current]);

    useEffect(() => {
      if (!!focusOnInitialRender && overlayRef.current) {
        setTimeout(() => {
          return overlayRef.current?.focus();
        });
      }
      return;
    }, [overlayRef.current]);

    const Wrapper = focusTrap ? FocusTrap : React.Fragment;
    const wrapperProps = focusTrap
      ? {
          focusTrapOptions: {
            fallbackFocus: '.Loader__overlay'
          }
        }
      : {};

    return (
      <Wrapper {...wrapperProps}>
        <div
          className={classNames('Loader__overlay', className)}
          ref={overlayRef}
          tabIndex={-1}
          {...other}
        >
          <div className="Loader__overlay__loader">
            <Loader />
            <AxeLoader />
          </div>
          {label ? (
            <span className="Loader__overlay__label">{label}</span>
          ) : null}
          {children}
        </div>
      </Wrapper>
    );
  }
);

LoaderOverlay.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  focusOnInitialRender: PropTypes.bool,
  children: PropTypes.node
};

LoaderOverlay.displayName = 'LoaderOverlay';

export default LoaderOverlay;

import React from 'react';
import Offscreen from '../Offscreen';
import classNames from 'classnames';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  variant?: 'large' | 'small';
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, variant = 'small', label, ...props }: LoaderProps, ref) => {
    if (label?.length) {
      props['role'] = 'alert';
      props.children = <Offscreen>{label}</Offscreen>;
    } else {
      props['aria-hidden'] = true;
    }

    return (
      <div
        ref={ref}
        className={classNames(
          'Loader',
          className,
          variant === 'large' && 'Loader--large',
          variant === 'small' && 'Loader--small'
        )}
        {...props}
      />
    );
  }
);

Loader.displayName = 'Loader';

export default Loader;

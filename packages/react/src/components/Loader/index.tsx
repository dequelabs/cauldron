import React from 'react';
import PropTypes from 'prop-types';
import Offscreen from '../Offscreen';
import classNames from 'classnames';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, label, ...props }: LoaderProps, ref) => {
    if (label?.length) {
      props['role'] = 'alert';
      props.children = <Offscreen>{label}</Offscreen>;
    } else {
      props['aria-hidden'] = true;
    }

    return (
      <div ref={ref} className={classNames('Loader', className)} {...props} />
    );
  }
);

Loader.propTypes = {
  className: PropTypes.string
};

Loader.displayName = 'Loader';

export default Loader;

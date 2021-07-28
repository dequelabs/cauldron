import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
}

export default function Loader({ label, className, ...other }: LoaderProps) {
  const props = {
    ...other,
    className: classNames('Loader', className),
    'aria-hidden': !label
  };

  if (label) {
    props.role = 'progressbar';
    props['aria-valuetext'] = label;
    props['aria-busy'] = true;
    props['aria-valuemin'] = 0;
    props['aria-valuemax'] = 100;
    // According to the  ARIA 1.2 spec (https://www.w3.org/TR/wai-aria-1.2/#progressbar),
    // the aria-valuenow attribute SHOULD be omitted because the "value" of our progress
    // is "indeterminate".
  }

  return <div {...props} />;
}

Loader.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string
};

Loader.displayName = 'Loader';

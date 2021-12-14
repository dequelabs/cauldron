import { Cauldron } from '../../types';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export type LoaderProps = React.HTMLAttributes<HTMLDivElement> &
  Partial<Cauldron.LabelProps>;

export default function Loader({ className, ...other }: LoaderProps) {
  const props = {
    ...other,
    className: classNames('Loader', className)
  };

  const { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy } = props;
  const hasLabel = ariaLabel || ariaLabelledBy;

  if (hasLabel) {
    props['role'] = 'alert';
    props['aria-busy'] = true;
  } else {
    props['aria-hidden'] = true;
  }

  return <div {...props} />;
}

Loader.propTypes = {
  className: PropTypes.string
};

Loader.displayName = 'Loader';

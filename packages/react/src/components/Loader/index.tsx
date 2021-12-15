import { Cauldron } from '../../types';
import React from 'react';
import PropTypes from 'prop-types';
import Offscreen from '../Offscreen';
import classNames from 'classnames';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export default function Loader({ className, label, ...other }: LoaderProps) {
  const props = {
    ...other,
    className: classNames('Loader', className)
  };

  if (label?.length) {
    props['role'] = 'alert';
    props.children = <Offscreen>{label}</Offscreen>;
  } else {
    props['aria-hidden'] = true;
  }

  return <div {...props} />;
}

Loader.propTypes = {
  className: PropTypes.string
};

Loader.displayName = 'Loader';

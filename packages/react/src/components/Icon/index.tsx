import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  // TODO: allowed "types" should be defined here (intellisense, etc)
  type: string;
}

const Icon = ({ label, type, className, ...other }: IconProps) => {
  const data = {
    ...other,
    'aria-hidden': !label,
    className: classNames('fa', type, className)
  };

  if (label) {
    data['aria-label'] = label;
  }

  return <div {...data} />;
};

Icon.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default Icon;

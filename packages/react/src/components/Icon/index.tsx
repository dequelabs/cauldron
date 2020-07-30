import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  // TODO: allowed "types" should be defined here (intellisense, etc)
  type: string;
}

const Icon = ({ label, type, className, ...other }: IconProps) => {
  let IconSVG = () => null;
  const [, name, direction] = type.match(/(.*)-(right|left|up|down)$/) || [
    '',
    type
  ];
  try {
    IconSVG = require(`./icons/${name}.svg`).default;
  } catch (ex) {
    console.error(`Could not find icon type "${type}".`);
  }
  const data = {
    ...other,
    'aria-hidden': !label,
    className: classNames('Icon', `Icon--${type}`, className, {
      [`Icon__${direction}`]: !!direction
    })
  };

  if (label) {
    data['aria-label'] = label;
  }

  return (
    <div {...data}>
      <IconSVG />
    </div>
  );
};

Icon.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string.isRequired
};

Icon.displayName = 'Icon';

export default Icon;

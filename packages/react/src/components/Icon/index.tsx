import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  type:
    | 'arrow-up'
    | 'arrow-down'
    | 'arrow-left'
    | 'arrow-right'
    | 'bolt'
    | 'checkbox-checked'
    | 'checkbox-unchecked'
    | 'chevron-up'
    | 'chevron-down'
    | 'chevron-left'
    | 'chevron-right'
    | 'chevron-double-up'
    | 'chevron-double-down'
    | 'chevron-double-left'
    | 'chevron-double-right'
    | 'close'
    | 'code'
    | 'exchange'
    | 'external-link'
    | 'eye'
    | 'flag'
    | 'gears'
    | 'info-circle'
    | 'kabob'
    | 'menu'
    | 'plus'
    | 'question-circle'
    | 'radio-checked'
    | 'radio-unchecked'
    | 'run-again'
    | 'star'
    | 'sun'
    | 'target'
    | 'trash';
}

function Icon({ label, className, type, ...other }: IconProps) {
  const [, name, direction] = type.match(/(.*)-(right|left|up|down)$/) || [
    '',
    type
  ];
  const [IconSVG, setIcon] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import(`./icons/${name}.svg`)
      .then(icon => {
        setIcon(() => icon.default);
      })
      .catch(ex => {
        console.error(`Could not find icon type "${type}".`);
        setIcon(null);
      });
  }, [type]);

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

  return <div {...data}>{IconSVG && <IconSVG />}</div>;
}

Icon.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string.isRequired
};

Icon.displayName = 'Icon';

export default Icon;

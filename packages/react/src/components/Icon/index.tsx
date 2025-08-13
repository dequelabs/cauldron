import React, { useState, useEffect, useRef, forwardRef } from 'react';
import Offscreen from '../Offscreen';
import classNames from 'classnames';
import { type IconType, iconTypes } from './types';

export { IconType, iconTypes };

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  type: IconType;
}

/**
 * Some icons have a mapped type different from their filename;
 * This is only a temporary measure to consolidate similar icons
 * until we can address Cauldron's iconography.
 * see: https://github.com/dequelabs/cauldron/issues/869
 */
const MAPPED_TYPES: Record<string, IconType> = {
  'filter-solid': 'filter'
};

const Icon = forwardRef<HTMLDivElement, IconProps>(
  ({ label, className, type, ...other }: IconProps, ref) => {
    const isMounted = useRef(true);
    const [, name, direction] = type.match(/(.*)-(right|left|up|down)$/) || [
      '',
      type
    ];
    const [IconSVG, setIcon] = useState<React.ComponentType<unknown> | null>(
      null
    );

    useEffect(() => {
      isMounted.current = true;
      // NOTE: we don't want to pollute test output with
      //  console.errors as a result of the dynamic imports
      if (process.env.NODE_ENV === 'test') {
        return;
      }

      const iconName = MAPPED_TYPES[name] || name;
      import(`./icons/${iconName}.svg`)
        .then((icon) => {
          isMounted.current && setIcon(() => icon.default);
        })
        .catch(() => {
          console.error(`Could not find icon type "${type}".`);
          isMounted.current && setIcon(null);
        });

      return () => {
        isMounted.current = false;
      };
    }, [type]);

    const data = {
      ...other,
      'aria-hidden': !label,
      className: classNames('Icon', `Icon--${type}`, className, {
        [`Icon__${direction}`]: !!direction
      })
    };

    return (
      <span ref={ref} {...data}>
        {label && <Offscreen>{label}</Offscreen>}
        {IconSVG && <IconSVG />}
      </span>
    );
  }
);

Icon.displayName = 'Icon';

export default Icon;

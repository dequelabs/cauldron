import React, { HTMLAttributes, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import rndid from '../../utils/rndid';

interface PanelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  heading?:
    | ReactElement<any>
    | {
        id?: string;
        text: ReactElement<any>;
        level: number | undefined;
      };
  collapsed?: boolean;
  className?: string;
}

const Panel = ({
  children,
  collapsed,
  className,
  heading,
  ...other
}: PanelProps) => {
  const headingId =
    heading && typeof heading === 'object' && 'id' in heading
      ? heading.id
      : rndid();
  const Heading = heading
    ? (`h${
        typeof heading === 'object' && 'level' in heading && !!heading.level
          ? heading.level
          : 2
      }` as 'h1')
    : null;

  return (
    <section
      aria-labelledby={headingId}
      className={classNames('Panel', className, {
        ['Panel--collapsed']: collapsed
      })}
      {...other}
    >
      {Heading && (
        <Heading id={headingId} className="Panel__Heading">
          {typeof heading === 'object' && 'text' in heading
            ? heading.text
            : heading}
        </Heading>
      )}
      {children}
    </section>
  );
};

Panel.displayName = 'Panel';
Panel.propTypes = {
  children: PropTypes.node.isRequired,
  heading: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
  className: PropTypes.string
};

export default Panel;

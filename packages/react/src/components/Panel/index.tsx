import React, { HTMLAttributes, ReactNode } from 'react';
import PanelHeader from './PanelHeader';
import PanelContent from './PanelContent';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import rndid from '../../utils/rndid';

interface PanelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode | ReactNode[];
  heading?:
    | ReactNode
    | {
        id?: string;
        text: ReactNode;
        level: number | undefined;
      };
  collapsed?: boolean;
  className?: string;
  padding?: boolean;
}

const Panel = ({
  children,
  collapsed,
  className,
  heading,
  padding = true,
  ...other
}: PanelProps) => {
  const headingId = !heading
    ? undefined
    : typeof heading === 'object' && 'id' in heading
    ? heading.id
    : rndid();

  const Heading = () => {
    if (!headingId) {
      return null;
    }

    const HeadingComponent = `h${
      heading &&
      typeof heading === 'object' &&
      'level' in heading &&
      !!heading.level
        ? heading.level
        : 2
    }` as 'h1';

    return (
      <div className="Panel__Heading">
        <HeadingComponent id={headingId}>
          {heading && typeof heading === 'object' && 'text' in heading
            ? heading.text
            : heading}
        </HeadingComponent>
      </div>
    );
  };

  return (
    <section
      aria-labelledby={headingId}
      className={classNames('Panel', className, {
        ['Panel--collapsed']: collapsed,
        ['Panel--padding']: padding
      })}
      {...other}
    >
      <Heading />
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

export { PanelHeader, PanelContent };

export default Panel;

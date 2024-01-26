import React from 'react';
import classnames from 'classnames';

type TimelineProps = React.HTMLAttributes<HTMLOListElement>;

export default function Timeline({
  className,
  children,
  ...props
}: TimelineProps): JSX.Element {
  return (
    <ol className={classnames('Timeline', className)} {...props}>
      {children}
    </ol>
  );
}

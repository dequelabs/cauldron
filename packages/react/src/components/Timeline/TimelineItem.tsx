import React from 'react';
import classnames from 'classnames';

interface TimelineItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactElement;
}

export default function TimelineItem({
  className,
  children,
  icon,
  ...props
}: TimelineItemProps): JSX.Element {
  return (
    <li className={classnames('TimelineItem', className)} {...props}>
      <span className="TimelineItem__separator">{icon}</span>
      <div className="TimelineItem__details">{children}</div>
    </li>
  );
}

import React, { forwardRef } from 'react';
import classnames from 'classnames';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Heading text to be displayed for the empty state. */
  heading: React.ReactNode;

  /** Description for the empty state. */
  description: React.ReactNode;

  /** Slot for primary actions. */
  primaryActions?: React.ReactNode;

  /** Slot for secondary actions. */
  secondaryActions?: React.ReactNode;
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      heading,
      description,
      primaryActions,
      secondaryActions,
      ...props
    },
    ref
  ) => {
    if (typeof heading === 'string') {
      heading = <h2>{heading}</h2>;
    }

    return (
      <div ref={ref} className={classnames('EmptyState', className)} {...props}>
        {heading}
        <p>{description}</p>
        {primaryActions && (
          <div className="EmptyState__primary">{primaryActions}</div>
        )}
        {secondaryActions && (
          <div className="EmptyState__secondary">{secondaryActions}</div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;

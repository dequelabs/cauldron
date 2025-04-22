import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  heading: ReactNode;
  description?: ReactNode;
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, heading, description, children, ...otherProps }, ref) => {
    if (typeof heading === 'string') {
      heading = <h2>{heading}</h2>;
    }
    return (
      <div
        className={classNames('SectionHeader', className)}
        ref={ref}
        {...otherProps}
      >
        <div className="SectionHeader__content">
          {heading}
          {description && (
            <p className="SectionHeader__description">{description}</p>
          )}
          {children && <div className="SectionHeader__actions">{children}</div>}
        </div>
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;

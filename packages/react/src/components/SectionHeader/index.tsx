import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface SectionHeaderProps {
  heading: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, heading, description, children, ...otherProps }, ref) => {
    return (
      <div className="sectionHeaderContainerContext">
        <div
          className={classNames('SectionHeader', className)}
          ref={ref}
          {...otherProps}
        >
          <div className="SectionHeader__textSection">
            {typeof heading === 'string' ? (
              <h2 className="SectionHeader__heading">{heading}</h2>
            ) : (
              React.cloneElement(
                heading as React.ReactElement<HTMLHeadingElement>,
                {
                  className: 'SectionHeader__heading'
                }
              )
            )}
            {description && (
              <div className="SectionHeader__description">{description}</div>
            )}
          </div>
          {children && <div className="SectionHeader__actions">{children}</div>}
        </div>
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;

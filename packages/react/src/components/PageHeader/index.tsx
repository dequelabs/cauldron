import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export type PageHeaderProps = {
  heading: string;
  overline?: ReactNode;
  description?: ReactNode;
  children?: React.ReactNode;
  className?: string;
};

const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      className,
      heading,
      overline,
      description,
      children,
      ...otherProps
    }: PageHeaderProps,
    ref
  ) => {
    return (
      <div className="pageHeaderContainerContext">
        <div
          className={classNames('PageHeader', className)}
          ref={ref}
          {...otherProps}
        >
          <div className="PageHeader__textSection">
            {overline && <div className="PageHeader__overline">{overline}</div>}

            {typeof heading === 'string' ? (
              <h1 className="PageHeader__heading">{heading}</h1>
            ) : (
              React.cloneElement(
                heading as React.ReactElement<HTMLHeadingElement>,
                {
                  className: 'PageHeader__heading'
                }
              )
            )}
            {description && (
              <div className="PageHeader__description">{description}</div>
            )}
          </div>
          {children && <div className="PageHeader__actions">{children}</div>}
        </div>
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export default PageHeader;

import React, { forwardRef, ReactNode } from 'react';
import SectionHeader from '../SectionHeader';
import classNames from 'classnames';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: ReactNode;
  overline?: ReactNode;
  description?: ReactNode;
}

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
    if (typeof heading === 'string') {
      heading = <h1>{heading}</h1>;
    }

    return (
      <div
        className={classNames('PageHeader', className)}
        ref={ref}
        {...otherProps}
      >
        {overline && <div className="PageHeader__overline">{overline}</div>}
        <SectionHeader heading={heading} description={description}>
          {children}
        </SectionHeader>
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export default PageHeader;

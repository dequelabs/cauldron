import React, { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';

export interface PanelContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

const PanelContent = forwardRef<HTMLDivElement, PanelContentProps>(
  (
    { children, className, padding = true, ...otherProps }: PanelContentProps,
    ref
  ) => {
    return (
      <div
        className={classNames('Panel__Content', className, {
          ['Panel__Content--no-padding']: !padding
        })}
        ref={ref}
        {...otherProps}
      >
        {children}
      </div>
    );
  }
);

PanelContent.displayName = 'PanelContent';

export default PanelContent;

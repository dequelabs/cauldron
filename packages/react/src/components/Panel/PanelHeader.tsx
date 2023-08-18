import React, { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export interface PanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const PanelHeader = forwardRef<HTMLDivElement, PanelHeaderProps>(
  ({ children, className, ...otherProps }: PanelHeaderProps, ref) => {
    return (
      <div
        className={classNames('Panel__Header', className)}
        ref={ref}
        {...otherProps}
      >
        {children}
      </div>
    );
  }
);

PanelHeader.displayName = 'PanelHeader';

PanelHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default PanelHeader;

import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import classnames from 'classnames';

type ColumnGroupHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const ColumnGroupHeader = forwardRef<HTMLDivElement, ColumnGroupHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={classnames('TwoColumnPanel__GroupHeader', className)}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

ColumnGroupHeader.displayName = 'ColumnGroupHeader';
ColumnGroupHeader.propTypes = {
  className: PropTypes.string
};
export default ColumnGroupHeader;

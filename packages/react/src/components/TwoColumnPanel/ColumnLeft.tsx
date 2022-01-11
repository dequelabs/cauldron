import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { Cauldron } from '../../types';

type ColumnLeftProps = React.HTMLAttributes<HTMLDivElement> &
  Cauldron.LabelProps;

const ColumnLeft = forwardRef<HTMLDivElement, ColumnLeftProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <section
        className={classnames('TwoColumnPanel__Left', className)}
        {...props}
        ref={ref}
      >
        {children}
      </section>
    );
  }
);

ColumnLeft.displayName = 'ColumnLeft';

export default ColumnLeft;

import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { Cauldron } from '../../types';

type ColumnRightProps = React.HTMLAttributes<HTMLDivElement> &
  Cauldron.LabelProps;

const ColumnRight = forwardRef<HTMLDivElement, ColumnRightProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <section
        className={classnames('TwoColumnPanel__Right', className)}
        {...props}
        ref={ref}
      >
        {children}
      </section>
    );
  }
);

ColumnRight.displayName = 'ColumnRight';

export default ColumnRight;

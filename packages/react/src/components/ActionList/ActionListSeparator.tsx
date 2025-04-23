import React, { forwardRef } from 'react';
import classnames from 'classnames';

type ActionListSeparatorProps = React.HTMLAttributes<HTMLLIElement>;

const ActionListSeparator = forwardRef<HTMLLIElement, ActionListSeparatorProps>(
  (props, ref) => {
    return (
      <li
        ref={ref}
        className={classnames('ActionListSeparator')}
        role="separator"
        {...props}
      />
    );
  }
);

ActionListSeparator.displayName = 'ActionListSeparator';

export default ActionListSeparator;

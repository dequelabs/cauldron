import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { useActionListContext } from './ActionListContext';

type ActionListSeparatorProps = React.HTMLAttributes<HTMLLIElement>;

const ActionListSeparator = forwardRef<HTMLLIElement, ActionListSeparatorProps>(
  ({ className, ...props }, ref) => {
    const { role: contextRole } = useActionListContext();
    // list and listbox roles only support listitem or option roles respectively
    // see https://github.com/w3c/aria/issues/1889
    const separatorRole = ['list', 'listbox'].includes(contextRole as string)
      ? 'presentation'
      : 'separator';

    return (
      <li
        ref={ref}
        className={classnames('ActionListSeparator', className)}
        role={separatorRole}
        aria-hidden={separatorRole === 'presentation' || undefined}
        {...props}
      />
    );
  }
);

ActionListSeparator.displayName = 'ActionListSeparator';

export default ActionListSeparator;

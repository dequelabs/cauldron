import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { ListboxGroup } from '../Listbox';
import { ContentNode } from '../../types';

interface Props extends React.HTMLAttributes<HTMLUListElement> {
  label: ContentNode;
}

const ComboboxGroup = forwardRef<HTMLUListElement, Props>(
  ({ className, children, label, ...props }, ref): JSX.Element | null => {
    return (
      <ListboxGroup
        as="ul"
        className={classnames('ComboboxGroup', className)}
        ref={ref}
        label={label}
        groupLabelProps={{ className: 'ComboboxGroup__label' }}
        {...props}
      >
        {children}
      </ListboxGroup>
    );
  }
);

ComboboxGroup.displayName = 'ComboboxGroup';

export default ComboboxGroup;

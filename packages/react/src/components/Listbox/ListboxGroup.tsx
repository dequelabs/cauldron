import { ContentNode } from '../../types';
import React, { forwardRef } from 'react';
import { useId } from 'react-id-generator';

interface ListboxGroupProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType | string;
  groupLabelProps?: React.HTMLAttributes<HTMLLIElement>;
  label: ContentNode;
}

const ListboxGroup = forwardRef<HTMLElement, ListboxGroupProps>(
  (
    {
      as: Component = 'ul',
      children,
      id: propId,
      label,
      groupLabelProps,
      ...props
    },
    ref
  ): JSX.Element => {
    const [id] = propId ? [propId] : useId(1, 'listbox-group-label');
    return (
      <Component role="group" ref={ref} aria-labelledby={id} {...props}>
        <li role="presentation" id={id} {...groupLabelProps}>
          {label}
        </li>
        {children}
      </Component>
    );
  }
);

ListboxGroup.displayName = 'ListboxGroup';

export default ListboxGroup;

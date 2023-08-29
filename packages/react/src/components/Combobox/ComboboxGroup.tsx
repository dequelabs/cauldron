import React, { forwardRef, useState, useLayoutEffect } from 'react';
import classnames from 'classnames';
import { ListboxGroup } from '../Listbox';
import { useComboboxContext } from './ComboboxContext';
import type { ContentNode } from '../../types';
import useSharedRef from '../../utils/useSharedRef';

interface ComboboxGroupProps extends React.HTMLAttributes<HTMLUListElement> {
  label: ContentNode;
}

const ComboboxGroup = forwardRef<HTMLUListElement, ComboboxGroupProps>(
  ({ className, children, label, ...props }, ref): JSX.Element | null => {
    const { inputValue, autocomplete, matchingOptions } = useComboboxContext();
    const comboboxGroupRef = useSharedRef<HTMLUListElement>(ref);
    const [showGroup, setShowGroup] = useState(true);

    useLayoutEffect(() => {
      if (autocomplete === 'none' || !inputValue?.length) {
        return;
      }

      const elements = Array.from(matchingOptions.keys());
      const groupHasChildren = !!elements.find((element) =>
        comboboxGroupRef.current?.contains(element)
      );
      setShowGroup(groupHasChildren);
    }, [inputValue, autocomplete, matchingOptions]);

    return (
      <ListboxGroup
        as="ul"
        className={classnames('ComboboxGroup', className)}
        ref={comboboxGroupRef}
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

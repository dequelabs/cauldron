import React, { forwardRef, useMemo } from 'react';
import classnames from 'classnames';
import { ListboxGroup } from '../Listbox';
import { useComboboxContext } from './ComboboxContext';
import type { ContentNode } from '../../types';
import useSharedRef from '../../utils/useSharedRef';

interface ComboboxGroupProps extends React.HTMLAttributes<HTMLUListElement> {
  label: ContentNode;
}

const ComboboxGroup = forwardRef<HTMLUListElement, ComboboxGroupProps>(
  ({ className, children, label, ...props }, ref): React.JSX.Element | null => {
    const { inputValue, autocomplete, matchingOptions } = useComboboxContext();
    const comboboxGroupRef = useSharedRef<HTMLUListElement>(ref);

    // istanbul ignore next
    const showGroup = useMemo(() => {
      if (autocomplete === 'none' || !inputValue?.length) {
        return true;
      }

      const elements = Array.from(matchingOptions.keys());
      return !!elements.find((element) =>
        comboboxGroupRef.current?.contains(element)
      );
    }, [inputValue, autocomplete, matchingOptions]);

    return (
      <ListboxGroup
        as="ul"
        className={classnames('ComboboxGroup', className, {
          'ComboboxGroup--hidden': !showGroup
        })}
        aria-hidden={!showGroup}
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

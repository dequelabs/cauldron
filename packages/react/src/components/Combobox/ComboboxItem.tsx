import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import type { ListboxValue } from '../Listbox/ListboxOption';
import { ListboxOption, useListboxContext } from '../Listbox';
import Icon from '../Icon';
import useSharedRef from '../../utils/useSharedRef';
import type { ContentNode } from '../../types';

export type ComboboxValue = ListboxValue;

interface Props extends React.HTMLAttributes<HTMLLIElement> {
  disabled?: boolean;
  value?: ComboboxValue;
  description?: ContentNode;
}

const ComboboxMatch = ({
  children
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <span>{children}</span>;
};

const ComboboxItem = forwardRef<HTMLLIElement, Props>(
  (
    { className, children, disabled, id: propId, description, ...props },
    ref
  ): JSX.Element => {
    const [id] = propId ? [propId] : useId(1, 'combobox-item');
    const { selected } = useListboxContext();
    const comboboxItemRef = useSharedRef<HTMLElement>(ref);
    const isSelected =
      selected?.element && selected.element === comboboxItemRef.current;

    return (
      <ListboxOption
        as="li"
        className={classnames('ComboboxItem', className, {
          'ComboboxItem--disabled': disabled
        })}
        activeClass="ComboboxItem--active"
        ref={comboboxItemRef}
        disabled={disabled}
        id={id}
        {...props}
      >
        <ComboboxMatch>{children}</ComboboxMatch>
        {description && (
          <div className="ComboboxItem__description">{description}</div>
        )}
        {isSelected ? <Icon type="check-solid" /> : null}
      </ListboxOption>
    );
  }
);

ComboboxItem.displayName = 'ComboboxItem';

export default ComboboxItem;

import React, { forwardRef, useEffect } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import Icon from '../Icon';
import useSharedRef from '../../utils/useSharedRef';
import type { ListboxValue } from '../Listbox/ListboxOption';
import type { ContentNode } from '../../types';
import { ListboxOption, useListboxContext } from '../Listbox';
import { useComboboxContext } from './ComboboxContext';
import useIntersectionRef from '../../utils/useIntersectionRef';

export type ComboboxValue = Exclude<ListboxValue, number>;

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
  ): JSX.Element | null => {
    const [id] = propId ? [propId] : useId(1, 'combobox-item');
    const { selected, active } = useListboxContext();
    const { matches } = useComboboxContext();
    const comboboxItemRef = useSharedRef<HTMLElement>(ref);
    const intersectionRef = useIntersectionRef<HTMLElement>(comboboxItemRef, {
      root: null,
      threshold: 1.0
    });
    const isActive =
      active?.element && active.element === comboboxItemRef.current;
    const isSelected =
      selected?.element && selected.element === comboboxItemRef.current;

    // TODO: this code is bad I should feel bad for writing it
    if (
      !matches ||
      (typeof matches === 'function' && !matches(children as string))
    ) {
      // return null;
    }

    useEffect(() => {
      const intersectionEntry = intersectionRef.current;
      if (!intersectionEntry || !isActive) {
        return;
      }

      if (!intersectionEntry.isIntersecting) {
        comboboxItemRef.current.scrollIntoView({
          inline: 'nearest',
          block: intersectionEntry.intersectionRect.y <= 0 ? 'end' : 'nearest'
        });
      }
    }, [isActive]);

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
        <span>
          <ComboboxMatch>{children}</ComboboxMatch>
          {description && (
            <div className="ComboboxItem__description">{description}</div>
          )}
        </span>
        {isSelected ? <Icon type="check-solid" /> : null}
      </ListboxOption>
    );
  }
);

ComboboxItem.displayName = 'ComboboxItem';

export default ComboboxItem;

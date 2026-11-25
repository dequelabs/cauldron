import React, { forwardRef, useEffect } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import Icon from '../Icon';
import useSharedRef from '../../utils/useSharedRef';
import type { ListboxValue } from '../Listbox/ListboxOption';
import type { ContentNode } from '../../types';
import { ListboxOption, useListboxContext } from '../Listbox';
import { useComboboxContext } from './ComboboxContext';

export type ComboboxValue = Exclude<ListboxValue, number>;

interface ComboboxOptionProps extends React.HTMLAttributes<HTMLLIElement> {
  disabled?: boolean;
  value?: ComboboxValue;
  formValue?: ComboboxValue;
  description?: ContentNode;
  removeOptionLabel?: string;
  children: string;
}

const ComboboxMatch = ({
  children: text
}: {
  children: string;
}): React.JSX.Element => {
  const { inputValue } = useComboboxContext();

  if (!text) {
    return <span></span>;
  }

  if (!inputValue?.length) {
    return <span>{text}</span>;
  }

  const matchStart = text.toLowerCase().indexOf(inputValue?.toLowerCase());

  if (matchStart === -1) {
    return <span>{text}</span>;
  }

  const matchLength = inputValue.length;
  const matchBefore = text.substring(0, matchStart);
  const match = text.substring(matchStart, matchLength + matchStart);
  const matchAfter = text.substring(matchStart + matchLength);

  return (
    <>
      <span>{matchBefore}</span>
      <em className="ComboboxOption__match">{match}</em>
      <span>{matchAfter}</span>
    </>
  );
};

const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  (
    {
      className,
      children,
      disabled,
      id: propId,
      description,
      value: propValue,
      formValue,
      removeOptionLabel,
      ...props
    },
    ref
  ): React.JSX.Element | null => {
    const [id] = propId ? [propId] : useId(1, 'combobox-option');
    const { selected } = useListboxContext();
    const {
      selectedValues,
      setRemoveOptionLabels,
      matches,
      setMatchingOptions,
      setFormValues
    } = useComboboxContext();
    const comboboxOptionRef = useSharedRef<HTMLElement>(ref);
    const isSelected = !!(
      selected &&
      selected.findIndex(
        ({ element }) => element === comboboxOptionRef.current
      ) !== -1
    );
    const isMatching =
      (typeof matches === 'boolean' && matches) ||
      (typeof matches === 'function' && matches(children));

    useEffect(() => {
      const comboboxValue =
        typeof propValue !== 'undefined'
          ? propValue
          : (comboboxOptionRef.current?.textContent ?? undefined);
      const value =
        typeof formValue === 'undefined' ? comboboxValue : formValue;

      setFormValues((prev) => {
        const formValues = prev.filter((fv) => fv !== value);
        if (selectedValues.includes(comboboxValue)) {
          formValues.push(value);
        }
        return formValues;
      });

      setRemoveOptionLabels((prev) => {
        if (!removeOptionLabel) {
          return prev;
        }
        return selectedValues.map((value, index) =>
          value === comboboxValue ? removeOptionLabel : prev[index]
        );
      });
    }, [selectedValues, formValue]);

    useEffect(() => {
      if (isMatching) {
        const comboboxValue =
          typeof propValue !== 'undefined'
            ? propValue
            : (comboboxOptionRef.current?.textContent ?? undefined);
        setMatchingOptions((options) => {
          if (!comboboxOptionRef.current) return options;
          return new Map(
            options.set(comboboxOptionRef.current, {
              value: comboboxValue,
              displayValue: children as string,
              selected: isSelected
            })
          );
        });
      }

      return () => {
        setMatchingOptions((options) => {
          options.forEach((_value, element) => {
            // istanbul ignore else
            if (!element.isConnected) {
              options.delete(element);
            }
          });
          return new Map(options);
        });
      };
    }, [isMatching, isSelected]);

    if (!isMatching) {
      return null;
    }

    return (
      <ListboxOption
        as="li"
        className={classnames('ComboboxOption', className, {
          'ComboboxOption--disabled': disabled
        })}
        activeClass="ComboboxOption--active"
        // @ts-expect-error use HTMLElement even though the underlying element is an li element
        ref={comboboxOptionRef}
        disabled={disabled}
        id={id}
        value={propValue}
        {...props}
      >
        <span>
          <ComboboxMatch>{children}</ComboboxMatch>
          {description && (
            <div className="ComboboxOption__description">{description}</div>
          )}
        </span>
        {isSelected ? <Icon type="check-solid" /> : null}
      </ListboxOption>
    );
  }
);

ComboboxOption.displayName = 'ComboboxOption';

export default ComboboxOption;

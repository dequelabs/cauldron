import React, { forwardRef, useState, useRef, useCallback } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import { ContentNode } from '../../types';
import Listbox from '../Listbox';
import ComboboxItem from './ComboboxItem';
import type { ComboboxValue } from './ComboboxItem';
import type { ListboxOption } from '../Listbox/ListboxContext';

interface ComboboxItem {
  key?: string;
  label: string;
  value?: ComboboxValue;
  description?: string;
}

type ComboboxProps = {
  label: ContentNode;
  items?: ComboboxItem[];
  value?: ComboboxValue;
  defaultValue?: ComboboxValue;
  requiredText?: React.ReactNode;
  error?: React.ReactNode;
  onSelect?: <T extends HTMLElement = HTMLElement>({
    target,
    value
  }: {
    target: T;
    value: ComboboxValue;
  }) => void;
  onSelectionChange?: ({
    value
  }: {
    previousValue: ComboboxValue;
    value: ComboboxValue;
  }) => void;
} & React.InputHTMLAttributes<Omit<HTMLInputElement, 'value' | 'defaultValue'>>;

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      id: propId,
      className,
      label,
      children,
      items = [],
      value: propValue,
      defaultValue,
      requiredText = 'Required',
      error,
      onSelect,
      onSelectionChange,
      onChange,
      onKeyDown,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ): JSX.Element => {
    const [value, setValue] = useState<ComboboxValue>(
      defaultValue || propValue || ''
    );
    const [selectedValue, setSelectedValue] = useState<ComboboxValue>(value);
    const [open, setOpen] = useState(false);
    const [activeDescendant, setActiveDescendant] = useState<string | null>(
      null
    );
    const [id] = propId ? [propId] : useId(1, 'combobox');
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const isControlled = typeof propValue !== 'undefined';
    const isRequired = !!props.required;
    const hasError = !!error;

    const comboboxItems =
      children ||
      items.map((item, index) => (
        <ComboboxItem
          key={item.key || index}
          id={`${id}-option-${index + 1}`}
          description={item.description}
        >
          {item.label}
        </ComboboxItem>
      ));

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);
        if (!event.defaultPrevented) {
          setOpen(true);
        }
      },
      [onFocus]
    );

    const handleInputClick = useCallback(() => {
      setOpen(true);
    }, []);

    const handleComboboxItemMouseDown = useCallback(
      (event: React.MouseEvent<HTMLUListElement>) => {
        // prevent blur from triggering when activating combobox items
        event.preventDefault();
      },
      []
    );

    const handleComboboxItemClick = useCallback(() => {
      setOpen(false);
      // maintain focus within the input
      inputRef.current?.focus();
    }, []);

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur?.(event);
        setOpen(false);
      },
      [onBlur]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);

        if (event.key === 'Escape') {
          setOpen(false);
          return;
        }

        setOpen(true);

        // forward input events to listbox
        listboxRef.current?.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: event.key,
            bubbles: true,
            cancelable: true
          })
        );
      },
      [onKeyDown]
    );

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        if (!isControlled) {
          setValue(event.target.value);
        }
      },
      [isControlled, onChange]
    );

    const handleSelection = useCallback(
      ({
        target,
        value: listboxValue
      }: {
        target: HTMLElement;
        value: ComboboxValue;
      }) => {
        onSelect?.({ target, value });
        if (!isControlled) {
          setValue(listboxValue);
          setSelectedValue(listboxValue);
        }
      },
      [isControlled, onSelect]
    );

    const handleActiveChange = useCallback(({ element }: ListboxOption) => {
      if (element) {
        setActiveDescendant(element.getAttribute('id'));
        // element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
      }
    }, []);

    return (
      <div className={classnames('Combobox', className)} ref={ref}>
        <label
          className={classnames('Field__label', {
            'Field__label--is-required': isRequired,
            'Field__label--has-error': hasError
          })}
          id={`${id}-label`}
          htmlFor={`${id}-input`}
        >
          <span>{label}</span>
          {isRequired && (
            <span className="Field__required-text">{requiredText}</span>
          )}
        </label>
        <div
          className={classnames('Combobox__input', {
            'Combobox__input--error': hasError
          })}
          onClick={handleInputClick}
        >
          <input
            type="text"
            id={`${id}-input`}
            ref={inputRef}
            value={value}
            role="combobox"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-activedescendant={
              open && activeDescendant ? activeDescendant : undefined
            }
            {...props}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span className="Combobox__arrow" />
        </div>
        <Listbox
          className="Combobox__listbox"
          role="listbox"
          aria-labelledby={`${id}-label`}
          id={`${id}-listbox`}
          value={selectedValue}
          onMouseDown={handleComboboxItemMouseDown}
          onClick={handleComboboxItemClick}
          onSelect={handleSelection}
          onSelectionChange={onSelectionChange}
          onActiveChange={handleActiveChange}
          ref={listboxRef}
          tabIndex={undefined}
          aria-activedescendant=""
        >
          {comboboxItems}
        </Listbox>
        {hasError && (
          <div className="Error" id={`${id}-error`}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';

export default Combobox;

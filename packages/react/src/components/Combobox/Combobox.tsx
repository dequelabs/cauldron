import React, {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect
} from 'react';
import { createPortal } from 'react-dom';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import { ContentNode } from '../../types';
import Listbox from '../Listbox';
import ComboboxOption from './ComboboxOption';
import { ComboboxProvider } from './ComboboxContext';
import type { ComboboxValue } from './ComboboxOption';
import type { ListboxOption } from '../Listbox/ListboxContext';
import useSharedRef from '../../utils/useSharedRef';

interface ComboboxOption {
  key?: string;
  label: string;
  value?: ComboboxValue;
  description?: string;
}

interface ComboboxProps
  extends React.InputHTMLAttributes<
    Omit<HTMLInputElement, 'value' | 'defaultValue'>
  > {
  label: ContentNode;
  options?: ComboboxOption[];
  value?: ComboboxValue;
  defaultValue?: ComboboxValue;
  requiredText?: React.ReactNode;
  error?: React.ReactNode;
  autocomplete?: 'none' | 'manual' | 'automatic';
  onSelectionChange?: <T extends HTMLElement = HTMLElement>({
    target,
    value,
    previousValue
  }: {
    target: T;
    value: ComboboxValue;
    previousValue: ComboboxValue;
  }) => void;
  onActiveChange?: (option: ListboxOption) => void;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
}

const defaultAutocompleteMatches = (
  inputValue: string,
  value: string | undefined
) => {
  if (typeof value === 'undefined' || !value) {
    return true;
  }
  return value?.toLowerCase().includes(inputValue.toLowerCase());
};

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      id: propId,
      className,
      label,
      children,
      options = [],
      value: propValue,
      defaultValue,
      requiredText = 'Required',
      error,
      autocomplete = 'manual',
      onSelectionChange,
      onActiveChange,
      onChange,
      onKeyDown,
      onFocus,
      onBlur,
      portal,
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
    const comboboxRef = useSharedRef<HTMLDivElement>(ref);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const isControlled = typeof propValue !== 'undefined';
    const isRequired = !!props.required;
    const isAutocomplete = autocomplete !== 'none';
    const hasError = !!error;

    const comboboxOptions =
      children ||
      options.map((option, index) => (
        <ComboboxOption
          key={option.key || index}
          id={`${id}-option-${index + 1}`}
          description={option.description}
        >
          {option.label}
        </ComboboxOption>
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

    const handleComboboxOptionMouseDown = useCallback(
      (event: React.MouseEvent<HTMLUListElement>) => {
        // prevent blur from triggering when activating combobox options
        event.preventDefault();
      },
      []
    );

    const handleComboboxOptionClick = useCallback(() => {
      setOpen(false);
      // maintain focus on the input
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

        // Selection should not open the listbox or be
        // forwarded to the listbox component when closed
        if (event.key === 'Enter' && !open) {
          return;
        }

        setOpen(true);

        // Space should not trigger selection since the user could be typing
        // a value for autocompletion. Additionally when not open and there's
        // an active descendent we do not want to forward keydown events.
        if (event.key === ' ' || (!open && activeDescendant)) {
          return;
        }

        // forward input events to listbox
        listboxRef.current?.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: event.key,
            bubbles: true,
            cancelable: true
          })
        );
      },
      [onKeyDown, open]
    );

    useEffect(() => {
      setValue(propValue);
    }, [propValue]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        if (!isControlled) {
          setValue(event.target.value);
        }
      },
      [isControlled, onChange]
    );

    const handleSelectionChange = useCallback(
      ({
        target,
        value: listboxValue,
        previousValue
      }: Parameters<
        Exclude<
          React.ComponentProps<typeof Listbox>['onSelectionChange'],
          undefined
        >
      >[0]) => {
        const stringValue = listboxValue?.toString();

        if (!isControlled) {
          setValue(stringValue);
          setSelectedValue(stringValue);
        }

        onSelectionChange?.({
          target,
          value: stringValue,
          previousValue: previousValue?.toString()
        });
      },
      [isControlled, onSelectionChange]
    );

    const handleActiveChange = useCallback((option: ListboxOption) => {
      if (option.element) {
        setActiveDescendant(option.element.getAttribute('id'));
      }

      onActiveChange?.(option);
    }, []);

    const comboboxListbox = (
      <Listbox
        className="Combobox__listbox"
        role="listbox"
        aria-labelledby={`${id}-label`}
        id={`${id}-listbox`}
        value={selectedValue}
        onMouseDown={handleComboboxOptionMouseDown}
        onClick={handleComboboxOptionClick}
        onSelectionChange={handleSelectionChange}
        onActiveChange={handleActiveChange}
        ref={listboxRef}
        tabIndex={undefined}
        aria-activedescendant=""
      >
        {comboboxOptions}
      </Listbox>
    );

    return (
      <div className={classnames('Combobox', className)} ref={comboboxRef}>
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
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className={classnames('Combobox__input', {
            'Combobox__input--error': hasError
          })}
          // We're handling click here to open the listbox when the wrapping element is clicked,
          // there's already keyboard handlers to open the listbox on the input element
          onClick={handleInputClick}
        >
          <input
            type="text"
            id={`${id}-input`}
            ref={inputRef}
            value={value}
            role="combobox"
            aria-autocomplete={!isAutocomplete ? 'none' : 'list'}
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
        <ComboboxProvider
          inputValue={value}
          selectedValue={selectedValue}
          matches={!isAutocomplete || defaultAutocompleteMatches}
        >
          {portal
            ? createPortal(
                comboboxListbox,
                portal instanceof HTMLElement
                  ? portal
                  : portal.current || document.body
              )
            : comboboxListbox}
        </ComboboxProvider>
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

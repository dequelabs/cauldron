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
import type { ComboboxOptionState } from './ComboboxContext';
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
  renderNoResults?: (() => JSX.Element) | React.ReactElement;
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

const ComboboxNoResults = (): JSX.Element => {
  return (
    <div className="Combobox__empty" aria-live="polite">
      No results found.
    </div>
  );
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
      renderNoResults,
      portal,
      ...props
    },
    ref
  ): JSX.Element => {
    const [value, setValue] = useState<string>(defaultValue || propValue || '');
    const [matchingOptions, setMatchingOptions] = useState<
      Map<HTMLElement, ComboboxOptionState>
    >(new Map());
    const [selectedValue, setSelectedValue] = useState<string>(value || '');
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

    useEffect(() => {
      if (!open && selectedValue && value !== selectedValue) {
        setValue(selectedValue);
      }
      if (open && value === selectedValue) {
        setValue('');
      }
    }, [open]);

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);
        // istanbul ignore else
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

        const enterKeypress = event.key === 'Enter';
        const escKeypress = event.key === 'Escape';

        if (escKeypress) {
          setOpen(false);
          return;
        }

        // Selection should not open the listbox or be
        // forwarded to the listbox component when closed
        if (enterKeypress && !open) {
          return;
        }

        setOpen(true);

        // Space should not trigger selection since the user could be typing
        // a value for autocompletion. Additionally when not open and there's
        // an active descendent we do not want to forward keydown events.
        if (
          event.key === ' ' ||
          (!open && activeDescendant) ||
          (enterKeypress && !activeDescendant)
        ) {
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

        // Close combobox with keyboard selections
        if (enterKeypress && activeDescendant) {
          setOpen(false);
        }
      },
      [onKeyDown, open, activeDescendant]
    );

    useEffect(() => {
      if (typeof propValue !== 'undefined') {
        setValue(propValue);
      }
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

        // istanbul ignore else
        if (!isControlled) {
          setValue(stringValue || '');
          setSelectedValue(stringValue || '');
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
      // istanbul ignore else
      if (option.element) {
        setActiveDescendant(option.element.getAttribute('id'));
      }

      onActiveChange?.(option);
    }, []);

    const NoMatchingOptions = React.useMemo(
      () =>
        React.isValidElement(renderNoResults)
          ? () => renderNoResults
          : typeof renderNoResults === 'function'
          ? () => renderNoResults()
          : ComboboxNoResults,
      [renderNoResults]
    );

    const noMatchingOptions = !!value?.length && !matchingOptions.size && (
      <NoMatchingOptions />
    );

    const comboboxListbox = (
      <Listbox
        className={classnames('Combobox__listbox', {
          'Combobox__listbox--open': open
        })}
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
        {noMatchingOptions}
      </Listbox>
    );

    return (
      <div
        id={id}
        className={classnames('Combobox', className)}
        ref={comboboxRef}
      >
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
          autocomplete={autocomplete}
          inputValue={value}
          selectedValue={selectedValue}
          matches={!isAutocomplete || defaultAutocompleteMatches}
          matchingOptions={matchingOptions}
          setMatchingOptions={setMatchingOptions}
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

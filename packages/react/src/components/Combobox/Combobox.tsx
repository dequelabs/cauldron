import React, {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo
} from 'react';
import { createPortal } from 'react-dom';
import { useId } from 'react-id-generator';
import classnames from 'classnames';
import Listbox from '../Listbox';
import ComboboxOption from './ComboboxOption';
import { ComboboxProvider } from './ComboboxContext';
import type { ContentNode } from '../../types';
import type { ComboboxOptionState } from './ComboboxContext';
import type { ComboboxValue } from './ComboboxOption';
import type { ListboxOption } from '../Listbox/ListboxContext';
import useSharedRef from '../../utils/useSharedRef';
import { addIdRef } from '../../utils/idRefs';
import TextFieldWrapper from '../internal/TextFieldWrapper';

// Event Keys
const [Enter, Escape, Home, End] = ['Enter', 'Escape', 'Home', 'End'];

interface ComboboxOption {
  key?: string;
  label: string;
  value?: ComboboxValue;
  formValue?: ComboboxValue;
  description?: string;
}

interface BaseComboboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue'
  > {
  label: ContentNode;
  options?: ComboboxOption[];
  requiredText?: React.ReactNode;
  error?: React.ReactNode;
  autocomplete?: 'none' | 'manual' | 'automatic';
  onActiveChange?: (option: ListboxOption) => void;
  renderNoResults?: (() => React.JSX.Element) | React.ReactElement;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
  inputRef?: React.Ref<HTMLInputElement>;
}

interface SingleSelectComboboxProps extends BaseComboboxProps {
  value?: ComboboxValue;
  defaultValue?: ComboboxValue;
  onSelectionChange?: <T extends HTMLElement = HTMLElement>(props: {
    target: T;
    value: ComboboxValue;
    previousValue: ComboboxValue;
  }) => void;
}

type ListboxOnSelectionChange = Parameters<
  Exclude<
    React.ComponentPropsWithRef<typeof Listbox>['onSelectionChange'],
    undefined
  >
>[0];

const defaultAutoCompleteMatches = (inputValue: string, value: string) => {
  // istanbul ignore if
  if (!value) {
    return true;
  }
  return value.toLowerCase().includes(inputValue.toLowerCase());
};

const ComboboxNoResults = ({
  children
}: {
  children?: React.ReactNode;
}): React.JSX.Element => {
  return (
    <div className="ComboboxListbox__empty" role="alert" aria-live="polite">
      {children || 'No results found.'}
    </div>
  );
};

const Combobox = forwardRef<HTMLDivElement, SingleSelectComboboxProps>(
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
      name,
      renderNoResults,
      portal,
      inputRef: propInputRef = null,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ): React.JSX.Element => {
    const [matchingOptions, setMatchingOptions] = useState<
      Map<HTMLElement, ComboboxOptionState>
    >(new Map());
    const [inputValue, setInputValue] = useState(
      () => defaultValue || propValue || ''
    );
    const [selectedValues, setSelectedValues] = useState(() => {
      const value = defaultValue || propValue;
      return value ? [value] : [];
    });
    const [formValues, setFormValues] = useState<ComboboxValue[]>([]);
    const [open, setOpen] = useState(false);
    const [activeDescendant, setActiveDescendant] =
      useState<ListboxOption | null>(null);
    const [id] = propId ? [propId] : useId(1, 'combobox');
    const comboboxRef = useSharedRef<HTMLDivElement>(ref);
    const inputRef = useSharedRef<HTMLInputElement>(propInputRef);
    const listboxRef = useRef<HTMLUListElement>(null);
    const isControlled = typeof propValue !== 'undefined';
    const isRequired = !!props.required;
    const isAutoComplete = autocomplete !== 'none';
    const hasError = !!error;

    const comboboxOptions =
      children ||
      options.map((option, index) => (
        <ComboboxOption
          key={option.key || index}
          id={`${id}-option-${index + 1}`}
          description={option.description}
          value={option.value}
          formValue={option.formValue}
        >
          {option.label}
        </ComboboxOption>
      ));

    const triggerListboxKeyDown = useCallback(
      (key: string) => {
        listboxRef.current?.dispatchEvent(
          new KeyboardEvent('keydown', {
            key,
            bubbles: true,
            cancelable: true
          })
        );
      },
      [listboxRef]
    );

    useEffect(() => {
      if (!isAutoComplete) {
        return;
      }

      if (
        !open &&
        selectedValues.length &&
        !selectedValues.includes(inputValue)
      ) {
        setInputValue(selectedValues[selectedValues.length - 1]);
      }

      if (!open) {
        setActiveDescendant(null);
      }

      if (open && autocomplete === 'automatic' && !selectedValues.length) {
        // Fire a Home keydown event on listbox to ensure the first item is selected
        triggerListboxKeyDown(Home);
      }
    }, [open]);

    useEffect(() => {
      const [element, option] =
        Array.from(matchingOptions.entries()).find(
          ([, { selected }]) => selected
        ) || [];
      if (autocomplete === 'manual') {
        setActiveDescendant(!element ? null : { element, ...option });
      } else if (
        autocomplete === 'automatic' &&
        matchingOptions.size &&
        !selectedValues.length
      ) {
        // Fire a home keydown event on listbox to ensure the first item is selected
        requestAnimationFrame(() => {
          triggerListboxKeyDown(Home);
        });
      }
    }, [matchingOptions]);

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);
        // istanbul ignore else
        if (!event.defaultPrevented) {
          setOpen(true);
          if (
            selectedValues.length &&
            selectedValues.includes(inputValue) &&
            isAutoComplete
          ) {
            setInputValue('');
          }
        }
      },
      [onFocus, inputValue, selectedValues]
    );

    const handleInputClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        setOpen(true);
        if (
          selectedValues.length &&
          selectedValues.includes(inputValue) &&
          isAutoComplete
        ) {
          setInputValue('');
        }

        if (event.target !== inputRef.current) {
          // ensure focus is set on the input field
          inputRef.current?.focus();
        }
      },
      [inputValue, selectedValues]
    );

    const handleComboboxOptionMouseDown = useCallback(
      (event: React.MouseEvent<HTMLUListElement>) => {
        // prevent blur from triggering when activating combobox options
        event.preventDefault();
      },
      []
    );

    const handleComboboxOptionClick = useCallback(() => {
      // maintain focus on the input
      if (inputRef.current !== document.activeElement) {
        inputRef.current?.focus();
      }
    }, []);

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur?.(event);
        setOpen(false);
        if (autocomplete === 'automatic' && activeDescendant) {
          const activeValue =
            activeDescendant.value?.toString() ||
            /* istanbul ignore next: default value */ '';
          setInputValue(activeValue);
          setSelectedValues([activeValue]);
          onSelectionChange?.({
            target: activeDescendant.element,
            value: activeValue,
            previousValue: selectedValues[0]
          });
        }
      },
      [autocomplete, activeDescendant, onBlur]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);

        const enterKeypress = event.key === Enter;
        const escKeypress = event.key === Escape;
        const arrowKeypress = ['ArrowDown', 'ArrowUp'].includes(event.key);

        if (
          // prevent the page from scrolling and allow start/end option activation
          [Home, End].includes(event.key) ||
          // prevent combobox from submitting any forms when the listbox is expanded
          (enterKeypress && open)
        ) {
          event.preventDefault();
        }

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

        if (!open && arrowKeypress && selectedValues.length && isAutoComplete) {
          // If the user opens the combobox again with a selected value
          // just clear out the field to restore filtering capabilities
          setInputValue('');
        }

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
        triggerListboxKeyDown(event.key);

        // Close combobox with keyboard selections
        if (enterKeypress && activeDescendant) {
          setOpen(false);
        }
      },
      [onKeyDown, isAutoComplete, open, selectedValues, activeDescendant]
    );

    useEffect(() => {
      if (typeof propValue !== 'undefined') {
        setInputValue(propValue);
      }
    }, [propValue]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        // istanbul ignore else
        if (!isControlled) {
          setInputValue(event.target.value);
        }
      },
      [isControlled, onChange]
    );

    const handleSelectionChange = useCallback(
      ({
        target,
        value: listboxValue,
        previousValue
      }: ListboxOnSelectionChange) => {
        const value = listboxValue?.toString() || /* istanbul ignore next */ '';

        // istanbul ignore else
        if (!isControlled) {
          setInputValue(value);
        }

        setSelectedValues([value]);

        onSelectionChange?.({
          target,
          value: value,
          previousValue: previousValue?.toString()
        });

        setOpen(false);
      },
      [isControlled, onSelectionChange]
    );

    const handleActiveChange = useCallback((option: ListboxOption) => {
      // istanbul ignore else
      if (option.element) {
        setActiveDescendant(option);
      }

      onActiveChange?.(option);
    }, []);

    const NoMatchingOptions = useMemo(
      () =>
        React.isValidElement(renderNoResults)
          ? () => <ComboboxNoResults>{renderNoResults}</ComboboxNoResults>
          : typeof renderNoResults === 'function'
          ? () => <ComboboxNoResults>{renderNoResults()}</ComboboxNoResults>
          : ComboboxNoResults,
      [renderNoResults]
    );

    const noMatchingOptions = !!inputValue && !matchingOptions.size && (
      <NoMatchingOptions />
    );

    const comboboxListbox = (
      <Listbox
        className={classnames('Combobox__listbox', {
          'Combobox__listbox--open': open
        })}
        role={noMatchingOptions ? 'presentation' : 'listbox'}
        aria-labelledby={noMatchingOptions ? undefined : `${id}-label`}
        id={`${id}-listbox`}
        value={selectedValues[0]}
        onMouseDown={handleComboboxOptionMouseDown}
        onClick={handleComboboxOptionClick}
        onSelectionChange={handleSelectionChange}
        onActiveChange={handleActiveChange}
        ref={listboxRef}
        tabIndex={undefined}
        aria-activedescendant={undefined}
        multiselect={false}
      >
        {comboboxOptions}
        {noMatchingOptions}
      </Listbox>
    );

    const errorId = `${id}-error`;
    const inputProps = {
      ...props,
      'aria-describedby': error
        ? addIdRef(ariaDescribedby, errorId)
        : ariaDescribedby
    };

    return (
      <div
        id={id}
        className={classnames('Combobox', className)}
        ref={comboboxRef}
      >
        {name &&
          formValues.map((formValue) => (
            <input
              type="hidden"
              key={formValue}
              name={name}
              value={formValue}
            />
          ))}
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
            <span className="Field__required-text" aria-hidden="true">
              {requiredText}
            </span>
          )}
        </label>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <TextFieldWrapper
          className={classnames({ 'TextFieldWrapper--error': hasError })}
          // We're handling click here to open the listbox when the wrapping element is clicked,
          // there's already keyboard handlers to open the listbox on the input element
          onClick={handleInputClick}
        >
          <input
            type="text"
            id={`${id}-input`}
            ref={inputRef}
            value={inputValue}
            role="combobox"
            aria-autocomplete={!isAutoComplete ? 'none' : 'list'}
            aria-controls={`${id}-listbox`}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-activedescendant={
              open && activeDescendant ? activeDescendant.element.id : undefined
            }
            {...inputProps}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span className="Combobox__arrow" />
        </TextFieldWrapper>
        <ComboboxProvider
          autocomplete={autocomplete}
          inputValue={inputValue}
          formValues={formValues}
          selectedValues={selectedValues}
          matches={!isAutoComplete || defaultAutoCompleteMatches}
          matchingOptions={matchingOptions}
          setMatchingOptions={setMatchingOptions}
          setFormValues={setFormValues}
        >
          {portal && typeof document !== 'undefined'
            ? (createPortal(
                comboboxListbox,
                // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
                portal instanceof HTMLElement
                  ? portal
                  : portal.current ||
                      // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
                      /* istanbul ignore next: default fallback value */ document.body
              ) as React.ReactNode)
            : comboboxListbox}
        </ComboboxProvider>
        {hasError && (
          <div className="Error" id={errorId}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';

export default Combobox;

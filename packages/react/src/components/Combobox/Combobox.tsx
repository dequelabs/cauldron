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
import { addIdRef } from '../../utils/idRefs';
import TextFieldWrapper from '../internal/TextFieldWrapper';
import { ListboxValue } from '../Listbox/ListboxOption';
import TagButton from '../TagButton';

// Event Keys
const [Enter, Escape, Home, End] = ['Enter', 'Escape', 'Home', 'End'];

interface ComboboxOption {
  key?: string;
  label: string;
  value?: ComboboxValue;
  formValue?: ComboboxValue;
  description?: string;
}

interface ComboboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue'
  > {
  label: ContentNode;
  options?: ComboboxOption[];
  inputValue?: string;
  value?: ComboboxValue | ComboboxValue[];
  defaultValue?: ComboboxValue | ComboboxValue[];
  requiredText?: React.ReactNode;
  error?: React.ReactNode;
  autocomplete?: 'none' | 'manual' | 'automatic';
  multiselect?: boolean;
  onSelectionChange?: <T extends HTMLElement = HTMLElement>({
    target,
    value,
    previousValue
  }: {
    target: T | undefined;
    value: ComboboxValue | ComboboxValue[];
    previousValue: ComboboxValue | ComboboxValue[];
  }) => void;
  onActiveChange?: (option: ListboxOption) => void;
  renderNoResults?: (() => JSX.Element) | React.ReactElement;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
  inputRef?: React.Ref<HTMLInputElement>;
}

const getComboboxValue = (
  listboxValue: ListboxValue | ListboxValue[]
): ComboboxValue | ComboboxValue[] => {
  const isArr = Array.isArray(listboxValue);

  if (!listboxValue) return isArr ? [] : '';

  return isArr
    ? listboxValue.map((val) => val?.toString()).filter(Boolean)
    : listboxValue.toString();
};

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
}): JSX.Element => {
  return (
    <div className="ComboboxListbox__empty" role="alert" aria-live="polite">
      {children || 'No results found.'}
    </div>
  );
};

const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      id: propId,
      className,
      label,
      children,
      options = [],
      inputValue: propInputValue,
      value: propValue,
      defaultValue,
      requiredText = 'Required',
      error,
      autocomplete = 'manual',
      multiselect = false,
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
  ): JSX.Element => {
    const [value, setValue] = useState<ComboboxValue | ComboboxValue[]>(
      defaultValue || propValue || (multiselect ? [] : '')
    );
    const [inputValue, setInputValue] = useState<string>(propInputValue || '');
    const [matchingOptions, setMatchingOptions] = useState<
      Map<HTMLElement, ComboboxOptionState>
    >(new Map());
    const [selectedValue, setSelectedValue] = useState<
      ComboboxValue | ComboboxValue[]
    >(value || multiselect ? [] : '');
    const [formValue, setFormValue] = useState<string | undefined>('');
    const [open, setOpen] = useState(false);
    const [activeDescendant, setActiveDescendant] =
      useState<ListboxOption | null>(null);
    const [id] = propId ? [propId] : useId(1, 'combobox');
    const comboboxRef = useSharedRef<HTMLDivElement>(ref);
    const inputRef = useSharedRef<HTMLInputElement>(propInputRef);
    const listboxRef = useRef<HTMLUListElement>(null);
    const isControlled =
      typeof propValue !== 'undefined' && typeof propInputValue !== 'undefined';
    const isRequired = !!props.required;
    const isAutoComplete = autocomplete !== 'none';
    const hasError = !!error;
    const hasSelectedValue = multiselect
      ? (selectedValue as ComboboxValue[]).length !== 0
      : !!selectedValue;

    const comboboxOptions =
      children ||
      options.map((option, index) => (
        <ComboboxOption
          key={option.key || index}
          id={`${id}-option-${index + 1}`}
          value={option.value}
          formValue={option.formValue}
          description={option.description}
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

      if (!open && hasSelectedValue) {
        const isValueSameAsSelected = multiselect
          ? (value as ComboboxValue[]).every((val) =>
              (selectedValue as ComboboxValue[]).includes(val)
            )
          : value === selectedValue;
        if (!isValueSameAsSelected) {
          setValue(selectedValue);
        }
      }

      if (!open) {
        setActiveDescendant(null);
      }

      if (open && autocomplete === 'automatic' && !selectedValue) {
        // Fire a Home keydown event on listbox to ensure the first item is selected
        triggerListboxKeyDown(Home);
      }
    }, [open, value, selectedValue, triggerListboxKeyDown]);

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
        !hasSelectedValue
      ) {
        // Fire a home keydown event on listbox to ensure the first item is selected
        requestAnimationFrame(() => {
          triggerListboxKeyDown(Home);
        });
      }
    }, [
      matchingOptions,
      hasSelectedValue,
      setActiveDescendant,
      triggerListboxKeyDown
    ]);

    const handleReopen = useCallback(() => {
      setOpen(true);
      if (selectedValue && isAutoComplete) {
        let hasInputValueSelected = false;

        if (!multiselect) {
          hasInputValueSelected = inputValue === selectedValue;
        } else {
          hasInputValueSelected = (selectedValue as ComboboxValue[]).includes(
            inputValue
          );
        }

        if (hasInputValueSelected) {
          setInputValue('');
        }
      }
    }, [
      value,
      selectedValue,
      multiselect,
      isAutoComplete,
      setOpen,
      setInputValue
    ]);

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);
        // istanbul ignore else
        if (!event.defaultPrevented) {
          handleReopen();
        }
      },
      [onFocus, handleReopen]
    );

    const handleInputClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        handleReopen();

        if (event.target !== inputRef.current) {
          // ensure focus is set on the input field
          inputRef.current?.focus();
        }
      },
      [handleReopen]
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
          const stringValue =
            activeDescendant.value?.toString() ||
            /* istanbul ignore next: default value */ '';
          setInputValue(stringValue);
          if (!multiselect) {
            setValue(stringValue);
            setSelectedValue(stringValue);
          } else {
            const nextValue = (prev: ComboboxValue | ComboboxValue[]) => {
              const next = new Set(prev);
              next.add(stringValue);
              return Array.from(next);
            };
            setValue(nextValue);
            setSelectedValue(nextValue);
          }
        }
      },
      [
        autocomplete,
        activeDescendant,
        onBlur,
        setOpen,
        setInputValue,
        setValue,
        setSelectedValue
      ]
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

        if (!open && arrowKeypress && hasSelectedValue && isAutoComplete) {
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
      [
        onKeyDown,
        setOpen,
        triggerListboxKeyDown,
        isAutoComplete,
        open,
        hasSelectedValue,
        activeDescendant
      ]
    );

    useEffect(() => {
      if (typeof propValue !== 'undefined') {
        setValue(propValue);
      }
      if (typeof propInputValue !== 'undefined') {
        setInputValue(propInputValue);
      }
    }, [propValue, propInputValue]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        // istanbul ignore else
        if (!isControlled) {
          setInputValue(event.target.value);
        }
      },
      [isControlled, setInputValue, onChange]
    );

    const handleSelectionChange = useCallback(
      ({
        target,
        value: listboxValue,
        previousValue: listboxPreviousValue
      }: Parameters<
        Exclude<
          React.ComponentProps<typeof Listbox>['onSelectionChange'],
          undefined
        >
      >[0]) => {
        const comboboxValue = getComboboxValue(listboxValue);
        const comboboxPreviousValue = getComboboxValue(listboxPreviousValue);

        // istanbul ignore else
        if (!isControlled) {
          if (!Array.isArray(comboboxValue)) {
            setInputValue((comboboxValue as ComboboxValue) || '');
          }
          setValue(comboboxValue);
        }

        setSelectedValue(comboboxValue);

        onSelectionChange?.({
          target,
          value: comboboxValue,
          previousValue: comboboxPreviousValue
        });

        setOpen(false);
      },
      [isControlled, setValue, setSelectedValue, onSelectionChange, setOpen]
    );

    const handleActiveChange = useCallback(
      (option: ListboxOption) => {
        // istanbul ignore else
        if (option.element) {
          setActiveDescendant(option);
        }

        onActiveChange?.(option);
      },
      [setActiveDescendant, onActiveChange]
    );

    const NoMatchingOptions = React.useMemo(
      () =>
        React.isValidElement(renderNoResults)
          ? () => <ComboboxNoResults>{renderNoResults}</ComboboxNoResults>
          : typeof renderNoResults === 'function'
          ? () => <ComboboxNoResults>{renderNoResults()}</ComboboxNoResults>
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
        role={noMatchingOptions ? 'presentation' : 'listbox'}
        aria-labelledby={noMatchingOptions ? undefined : `${id}-label`}
        id={`${id}-listbox`}
        value={selectedValue}
        onMouseDown={handleComboboxOptionMouseDown}
        onClick={handleComboboxOptionClick}
        onSelectionChange={handleSelectionChange}
        onActiveChange={handleActiveChange}
        ref={listboxRef}
        tabIndex={undefined}
        aria-activedescendant={undefined}
        multiselect={multiselect}
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

    const removeValue = (val: ComboboxValue) => {
      const newSelected = (selectedValue as ComboboxValue[]).filter(
        (v) => v !== val
      );

      if (isControlled) {
        setValue(newSelected);
      }

      setSelectedValue(newSelected);
    };

    return (
      <div
        id={id}
        className={classnames('Combobox', className)}
        ref={comboboxRef}
      >
        {name && <input type="hidden" name={name} value={formValue} />}
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
        <TextFieldWrapper
          className={classnames({ 'TextFieldWrapper--error': hasError })}
          // We're handling click here to open the listbox when the wrapping element is clicked,
          // there's already keyboard handlers to open the listbox on the input element
          onClick={handleInputClick}
        >
          {multiselect &&
            (selectedValue as ComboboxValue[])?.map((val) => (
              <TagButton
                className="Combobox__selected-tag"
                key={val}
                label=""
                value={val || ''}
                icon="close"
                onClick={() => removeValue(val)}
              />
            ))}
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
              open && activeDescendant
                ? activeDescendant.element?.id
                : undefined
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
          multiselect={multiselect}
          inputValue={inputValue}
          formValue={formValue}
          selectedValue={selectedValue}
          matches={!isAutoComplete || defaultAutoCompleteMatches}
          matchingOptions={matchingOptions}
          setMatchingOptions={setMatchingOptions}
          setFormValue={setFormValue}
        >
          {portal && typeof document !== 'undefined'
            ? createPortal(
                comboboxListbox,
                // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
                portal instanceof HTMLElement
                  ? portal
                  : portal.current ||
                      // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
                      /* istanbul ignore next: default fallback value */ document.body
              )
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

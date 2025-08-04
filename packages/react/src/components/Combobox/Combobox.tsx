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
import { ListboxValue } from '../Listbox/ListboxOption';
import ComboboxPill from './ComboboxPill';
import Icon from '../Icon';
import classNames from 'classnames';

// Event Keys
const [Enter, Escape, Home, End, Backspace, Delete] = [
  'Enter',
  'Escape',
  'Home',
  'End',
  'Backspace',
  'Delete'
];

const [ArrowDown, ArrowUp, ArrowLeft, ArrowRight] = [
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight'
];

const PillKeys = [Backspace, Delete, ArrowLeft, ArrowRight];

interface ComboboxOption {
  key?: string;
  label: string;
  value?: ComboboxValue;
  formValue?: ComboboxValue;
  description?: string;
  removeOptionLabel?: string;
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
  description?: React.ReactNode;
}

interface SingleSelectComboboxProps extends BaseComboboxProps {
  value?: ComboboxValue;
  defaultValue?: ComboboxValue;
  inputValue?: never;
  defaultInputValue?: never;
  onSelectionChange?: <T extends HTMLElement = HTMLElement>(props: {
    target: T;
    value: ComboboxValue;
    previousValue: ComboboxValue;
  }) => void;
  multiselect?: false;
}

interface MultiSelectComboboxProps extends BaseComboboxProps {
  value?: ComboboxValue[];
  defaultValue?: ComboboxValue[];
  inputValue?: ComboboxValue;
  defaultInputValue?: ComboboxValue;
  onSelectionChange?: <T extends HTMLElement = HTMLElement>(props: {
    target: T;
    value: ComboboxValue[];
    previousValue: ComboboxValue[];
  }) => void;
  multiselect: true;
}

type ListboxOnSelectionChange = Parameters<
  Exclude<
    React.ComponentPropsWithRef<typeof Listbox>['onSelectionChange'],
    undefined
  >
>[0];

type OnSingleSelectionChange = SingleSelectComboboxProps['onSelectionChange'];
type OnMultiSelectionChange = MultiSelectComboboxProps['onSelectionChange'];

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

const Combobox = forwardRef<
  HTMLDivElement,
  SingleSelectComboboxProps | MultiSelectComboboxProps
>(
  (
    {
      id: propId,
      className,
      label,
      children,
      options = [],
      value: propValue,
      defaultValue,
      inputValue: propInputValue,
      defaultInputValue,
      multiselect = false,
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
      description,
      'aria-describedby': ariaDescribedby,
      disabled = false,
      ...props
    },
    ref
  ): React.JSX.Element => {
    const [matchingOptions, setMatchingOptions] = useState<
      Map<HTMLElement, ComboboxOptionState>
    >(new Map());
    const [inputValue, setInputValue] = useState(() => {
      const value = defaultValue || propValue;
      const inputVal = defaultInputValue || propInputValue;
      return (Array.isArray(value) ? inputVal : value) || '';
    });
    const [selectedValues, setSelectedValues] = useState(() => {
      const value = defaultValue || propValue;
      if (!value) {
        return [];
      }
      return Array.isArray(value) ? value : [value];
    });
    const [removeOptionLabels, setRemoveOptionLabels] = useState<string[]>([]);
    const [formValues, setFormValues] = useState<ComboboxValue[]>([]);
    const [open, setOpen] = useState(false);
    const [activeDescendant, setActiveDescendant] =
      useState<ListboxOption | null>(null);
    const [id] = propId ? [propId] : useId(1, 'combobox');
    const comboboxRef = useSharedRef<HTMLDivElement>(ref);
    const inputRef = useSharedRef<HTMLInputElement>(propInputRef);
    const listboxRef = useRef<HTMLUListElement>(null);
    const pillsRef = useRef<HTMLButtonElement[]>([]);
    const isControlled =
      typeof propValue !== 'undefined' &&
      (multiselect ? typeof propInputValue !== 'undefined' : true);
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
          removeOptionLabel={option.removeOptionLabel}
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
        !multiselect &&
        selectedValues.length &&
        !selectedValues.includes(inputValue)
      ) {
        setInputValue(selectedValues[selectedValues.length - 1] || '');
      }

      if (!open) {
        setActiveDescendant(null);
      }

      if (open && autocomplete === 'automatic' && !selectedValues.length) {
        // Fire a Home keydown event on listbox to ensure the first item is selected
        triggerListboxKeyDown(Home);
      }
    }, [open, multiselect, autocomplete, selectedValues]);

    useEffect(() => {
      const lastSelectedValue =
        selectedValues.length !== 0
          ? selectedValues[selectedValues.length - 1]
          : undefined;
      const [element, option] =
        Array.from(matchingOptions.entries()).find(
          ([, { value }]) => value === lastSelectedValue
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
    }, [selectedValues, matchingOptions]);

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
        if (!disabled) {
          setOpen(true);
        }
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
      [disabled, inputValue, selectedValues]
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

          if (!multiselect) {
            setSelectedValues([activeValue]);
            (onSelectionChange as OnSingleSelectionChange)?.({
              target: activeDescendant.element,
              value: activeValue,
              previousValue: selectedValues[0]
            });
          } else {
            const activeValueIndex = selectedValues.indexOf(activeValue);
            const newSelectedValues = selectedValues.filter(
              (v) => v !== activeValue
            );
            if (activeValueIndex === -1) {
              newSelectedValues.push(activeValue);
            }
            setSelectedValues(newSelectedValues);
            (onSelectionChange as OnMultiSelectionChange)?.({
              target: activeDescendant.element,
              value: newSelectedValues,
              previousValue: selectedValues
            });
          }
        }
      },
      [
        autocomplete,
        activeDescendant,
        onBlur,
        selectedValues,
        onSelectionChange
      ]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);

        const enterKeypress = event.key === Enter;
        const escKeypress = event.key === Escape;
        const deleteKeypress = event.key === Delete;
        const backspaceKeypress = event.key === Backspace;
        const listboxArrowKeypress = [ArrowUp, ArrowDown].includes(event.key);

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

        if (
          inputValue === '' &&
          (backspaceKeypress || deleteKeypress || event.key === ArrowLeft) &&
          pillsRef.current.length !== 0
        ) {
          pillsRef.current[pillsRef.current.length - 1]?.focus();
        }

        if (
          !open &&
          listboxArrowKeypress &&
          selectedValues.length &&
          isAutoComplete
        ) {
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
        if (enterKeypress && activeDescendant && !multiselect) {
          setOpen(false);
        }
      },
      [
        onKeyDown,
        isAutoComplete,
        open,
        multiselect,
        selectedValues,
        activeDescendant
      ]
    );

    useEffect(() => {
      if (isControlled) {
        if (!multiselect) {
          setInputValue((propValue as ComboboxValue) || '');
        } else {
          setInputValue((propInputValue as ComboboxValue) || '');
        }
      }
    }, [multiselect, propValue, propInputValue]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) {
          return;
        }
        onChange?.(event);
        // istanbul ignore else
        if (!isControlled) {
          setInputValue(event.target.value);
        }
      },
      [isControlled, onChange]
    );

    const handleRemovePill = useCallback(
      (target: HTMLElement, value: ComboboxValue) => {
        if (disabled) {
          return;
        }

        const newSelectedValues = selectedValues.filter((v) => v !== value);

        setSelectedValues(newSelectedValues);
        (onSelectionChange as OnMultiSelectionChange)?.({
          target,
          value: newSelectedValues,
          previousValue: selectedValues
        });
      },
      [disabled, selectedValues, onSelectionChange]
    );

    const handlePillKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!PillKeys.includes(event.key)) {
          return;
        }

        event.preventDefault();

        const isDelete = event.key === Delete;
        const isBackspace = event.key === Backspace;
        const isArrowLeft = event.key === ArrowLeft;
        const isArrowRight = event.key === ArrowRight;

        const focusedIndex = pillsRef.current.findIndex(
          (p) => document.activeElement === p
        );

        const pillsLength = pillsRef.current.length;

        if (isDelete || isBackspace) {
          if (disabled) {
            return;
          }

          handleRemovePill(
            pillsRef.current[focusedIndex],
            selectedValues[focusedIndex]
          );

          const nextIndex = focusedIndex + 1;

          if (nextIndex == pillsLength) {
            inputRef.current.focus();
          } else {
            pillsRef.current[nextIndex].focus();
          }
        } else if (isArrowLeft || isArrowRight) {
          const nextIndex = Math.max(focusedIndex + (isArrowLeft ? -1 : 1), 0);

          if (isArrowRight && nextIndex === pillsLength) {
            inputRef.current.focus();
          } else {
            pillsRef.current[nextIndex].focus();
          }
        }
      },
      [disabled, pillsRef, handleRemovePill]
    );

    const handleSelectionChange = useCallback(
      ({ target, value, previousValue }: ListboxOnSelectionChange) => {
        if (!multiselect) {
          const listboxValue = (value as ListboxValue)?.toString() || '';
          const listboxPreviousValue =
            (previousValue as ListboxValue)?.toString() || '';

          // istanbul ignore else
          if (!isControlled) {
            setInputValue(listboxValue);
          }

          setSelectedValues([listboxValue]);
          (onSelectionChange as OnSingleSelectionChange)?.({
            target,
            value: listboxValue,
            previousValue: listboxPreviousValue
          });
        } else {
          const listboxPreviousValue = previousValue as ComboboxValue[];
          const listboxValue = value as ComboboxValue[];

          const previousValueSet = new Set(listboxPreviousValue);
          const valueSet = new Set(listboxValue);

          const removedValues = new Set(
            listboxPreviousValue.filter((v) => !valueSet.has(v))
          );
          const addedValues = listboxValue.filter(
            (v) => !previousValueSet.has(v)
          );

          const newSelectedValues = selectedValues
            .filter((v) => !removedValues.has(v))
            .concat(addedValues);

          // istanbul ignore else
          if (!isControlled) {
            setInputValue('');
          }

          setSelectedValues(newSelectedValues);
          (onSelectionChange as OnMultiSelectionChange)?.({
            target,
            value: newSelectedValues,
            previousValue: selectedValues
          });
        }

        if (!multiselect) {
          setOpen(false);
        }
      },
      [isControlled, multiselect, selectedValues, onSelectionChange]
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
      // eslint-disable-next-line
      // @ts-expect-error
      // multiselect & value props are passed to Listbox, but TS is unable to infer that
      // it's a correct mapping from Combobox's multiselect & value props
      <Listbox
        className={classnames('Combobox__listbox', {
          'Combobox__listbox--open': open
        })}
        role={noMatchingOptions ? 'presentation' : 'listbox'}
        aria-labelledby={noMatchingOptions ? undefined : `${id}-label`}
        id={`${id}-listbox`}
        value={multiselect ? selectedValues : selectedValues[0]}
        onMouseDown={handleComboboxOptionMouseDown}
        onClick={handleComboboxOptionClick}
        onSelectionChange={handleSelectionChange}
        onActiveChange={handleActiveChange}
        ref={listboxRef}
        tabIndex={undefined}
        aria-activedescendant={undefined}
        multiselect={multiselect}
        disabled={disabled}
      >
        {comboboxOptions}
        {noMatchingOptions}
      </Listbox>
    );

    const errorId = `${id}-error`;
    const descriptionId = `${id}-description`;
    let describedby = ariaDescribedby;
    if (description) {
      describedby = addIdRef(describedby, descriptionId);
    }
    if (error) {
      describedby = addIdRef(describedby, errorId);
    }
    const inputProps = {
      ...props,
      'aria-describedby': describedby
    };

    return (
      <div
        id={id}
        className={classnames(
          'Combobox',
          { 'Combobox--multiselect': multiselect },
          className
        )}
        ref={comboboxRef}
      >
        {name &&
          formValues.map((formValue, index) => (
            <input type="hidden" key={index} name={name} value={formValue} />
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
        <div>
          {description && (
            <span
              className={classNames('Field__labelDescription', {
                'Field__labelDescription--disabled': disabled
              })}
              id={descriptionId}
            >
              {description}
            </span>
          )}
          {hasError && (
            <div className="Error" id={errorId}>
              <Icon type="caution" />
              {error}
            </div>
          )}
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <TextFieldWrapper
          className={classnames({ 'TextFieldWrapper--error': hasError })}
          // We're handling click here to open the listbox when the wrapping element is clicked,
          // there's already keyboard handlers to open the listbox on the input element
          onClick={handleInputClick}
        >
          {multiselect &&
            selectedValues.map((value, index) => {
              const refCallback = (elem: HTMLButtonElement | null) => {
                if (elem) {
                  pillsRef.current[index] = elem;
                } else {
                  pillsRef.current.splice(index, 1);
                }
              };

              const handleClick = () =>
                handleRemovePill(pillsRef.current[index], value);

              return (
                <ComboboxPill
                  ref={refCallback}
                  key={value}
                  value={value}
                  removeOptionLabel={removeOptionLabels[index]}
                  disabled={disabled}
                  onClick={handleClick}
                  onKeyDown={handlePillKeyDown}
                />
              );
            })}
          <input
            type="text"
            id={`${id}-input`}
            ref={inputRef}
            value={inputValue}
            role="combobox"
            disabled={disabled}
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
          removeOptionLabels={removeOptionLabels}
          setRemoveOptionLabels={setRemoveOptionLabels}
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
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';

export default Combobox;

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
import TagButton from '../TagButton';
import { closestElement } from '../../utils/closestElement';
import Button from '../Button';

// Event Keys
const [Enter, Escape, Home, End, Backspace, Delete] = [
  'Enter',
  'Escape',
  'Home',
  'End',
  'Backspace',
  'Delete'
];

const ArrowKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];

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

function nextToFocus(
  elements: HTMLElement[],
  fallback: HTMLElement,
  focusedIdx: number,
  direction: number
): HTMLElement | null {
  const elems = elements.concat(fallback);
  if (direction === -1) {
    return null;
  }

  const style = getComputedStyle(elems[focusedIdx]);
  const margin =
    parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);

  switch (direction) {
    case 0:
      return closestElement(elems, focusedIdx, 'down', margin);
    case 1:
      return closestElement(elems, focusedIdx, 'up', margin);
    case 2:
      return elems[Math.max(focusedIdx - 1, 0)];
    case 3:
      return elems[Math.min(focusedIdx + 1, elems.length - 1)];
    default:
      return elems[focusedIdx];
  }
}

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
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    });
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
        setInputValue(selectedValues[selectedValues.length - 1] || '');
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

          if (!multiselect) {
            setSelectedValues([activeValue]);
            (onSelectionChange as OnSingleSelectionChange)?.({
              target: activeDescendant.element,
              value: activeValue,
              previousValue: selectedValues[0]
            });
          } else {
            const idx = selectedValues.indexOf(activeValue);
            const newSelectedValues = selectedValues.filter(
              (v) => v !== activeValue
            );
            if (idx === -1) {
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
      [autocomplete, activeDescendant, onBlur]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);

        const enterKeypress = event.key === Enter;
        const escKeypress = event.key === Escape;
        const deleteKeypress = event.key === Delete;
        const backspaceKeypress = event.key === Backspace;
        const arrowKeypress = ArrowKeys.includes(event.key);

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

        if (inputValue === '' && (backspaceKeypress || deleteKeypress)) {
          pillsRef.current[pillsRef.current.length - 1]?.focus();
        }

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
      if (isControlled) {
        if (!multiselect) {
          setInputValue((propValue as ComboboxValue) || '');
        } else {
          setInputValue((propInputValue as ComboboxValue) || '');
        }
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

    const handleRemove = useCallback(
      (target: HTMLElement, value: ComboboxValue) => {
        if (disabled) return;

        const newSelectedValues = selectedValues.filter((v) => v !== value);
        if (!isControlled) {
          setInputValue(newSelectedValues[newSelectedValues.length - 1] || '');
        }

        setSelectedValues(newSelectedValues);
        (onSelectionChange as OnMultiSelectionChange)?.({
          target,
          value: newSelectedValues,
          previousValue: selectedValues
        });
      },
      [disabled, isControlled, selectedValues, onSelectionChange]
    );

    const handlePillKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const deleteKeypress = event.key === Delete;
        const backspaceKeypress = event.key === Backspace;

        const focusedIdx = pillsRef.current.findIndex(
          (p) => document.activeElement === p
        );

        const focusedPill = pillsRef.current[focusedIdx];

        if (deleteKeypress || backspaceKeypress) {
          if (disabled) return;
          handleRemove(focusedPill, focusedPill.innerText);
          const nextIdx = focusedIdx + 1;
          if (nextIdx >= pillsRef.current.length) {
            inputRef.current?.focus();
          } else {
            pillsRef.current[nextIdx].focus();
          }
          return;
        }

        const direction = ArrowKeys.indexOf(event.key);
        nextToFocus(
          pillsRef.current,
          inputRef.current,
          focusedIdx,
          direction
        )?.focus();
      },
      [disabled, pillsRef, handleRemove]
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
          const listboxValue = value as ComboboxValue[];
          const listboxPreviousValue = previousValue as ComboboxValue[];

          if (!isControlled) {
            setInputValue(listboxValue[listboxValue.length - 1] || '');
          }

          setSelectedValues(listboxValue);
          (onSelectionChange as OnMultiSelectionChange)?.({
            target,
            value: listboxValue,
            previousValue: listboxPreviousValue
          });
        }

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
      // eslint-disable-next-line
      // @ts-ignore
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
          className={classnames({
            'Combobox__TextFieldWrapper--multiselect': multiselect,
            'TextFieldWrapper--error': hasError
          })}
          // We're handling click here to open the listbox when the wrapping element is clicked,
          // there's already keyboard handlers to open the listbox on the input element
          onClick={handleInputClick}
        >
          {multiselect &&
            selectedValues.map((value, idx) => {
              const refCallback = (elem: HTMLButtonElement | null) => {
                if (elem) {
                  pillsRef.current[idx] = elem;
                } else {
                  pillsRef.current.splice(idx, 1);
                }
              };

              const handleClick = () =>
                handleRemove(pillsRef.current[idx], value);

              const commonProps = {
                ref: refCallback,
                key: value,
                className: 'Combobox__pill',
                tabIndex: -1,
                onClick: handleClick,
                onKeyDown: handlePillKeyDown
              };

              return !disabled ? (
                <TagButton
                  label=""
                  value={value || ''}
                  icon="close"
                  {...commonProps}
                />
              ) : (
                <Button disabled={disabled} {...commonProps}>
                  {value}
                </Button>
              );
            })}
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

import React, {
  useState,
  useRef,
  ChangeEvent,
  InputHTMLAttributes,
  forwardRef
} from 'react';
import classNames from 'classnames';
import { useId } from 'react-id-generator';
import { addIdRef } from '../../utils/idRefs';

import type { ContentNode } from '../../types';
import TextFieldWrapper from '../internal/TextFieldWrapper';
import Offscreen from '../Offscreen';
import Icon from '../Icon';

interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: ContentNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  hideLabel?: boolean;
  isForm?: boolean;
  error?: React.ReactNode;
  trailingChildren?: React.ReactNode;
}

const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      label,
      defaultValue = '',
      onChange,
      hideLabel = false,
      placeholder = 'Search...',
      isForm = true,
      id: propId,
      value: propValue,
      error = null,
      trailingChildren,
      'aria-describedby': ariaDescribedby,
      ...otherProps
    }: SearchFieldProps,
    ref
  ) => {
    const isControlled = typeof propValue !== 'undefined';

    const [value, setValue] = useState<string | undefined>(
      isControlled ? propValue : defaultValue
    );

    const [idForInput] = propId ? [propId] : useId(1, 'search-field');
    const [idForError] = useId(1, 'search-field-error');
    const inputId = useRef(idForInput).current;
    const errorId = useRef(idForError).current;
    const inputProps = {
      'aria-describedby': error
        ? addIdRef(ariaDescribedby, errorId)
        : ariaDescribedby
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (typeof onChange === 'function') {
        onChange(newValue, e);
      }

      if (isControlled) {
        return;
      }

      setValue(newValue);
    };

    const Field = isForm ? 'form' : 'div';

    if (typeof trailingChildren === 'string') {
      trailingChildren = <span>{trailingChildren}</span>;
    }

    return (
      <Field
        role={isForm ? 'search' : undefined}
        className="SearchField"
        aria-labelledby={isForm ? `${inputId}-label` : undefined}
      >
        {hideLabel ? (
          <Offscreen>
            <label htmlFor={inputId} id={`${inputId}-label`}>
              {label}
            </label>
          </Offscreen>
        ) : (
          <label
            className="Field__label"
            htmlFor={inputId}
            id={`${inputId}-label`}
          >
            {label}
          </label>
        )}
        <TextFieldWrapper
          className={classNames({
            'TextFieldWrapper--disabled': otherProps.disabled,
            'TextFieldWrapper--error': error
          })}
        >
          <Icon type="magnifying-glass" className="SearchField__search-icon" />
          <input
            id={inputId}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            ref={ref}
            {...inputProps}
            {...otherProps}
            className={classNames(otherProps.className, 'Field__text-input')}
            type="search"
          />
          {trailingChildren}
        </TextFieldWrapper>
        {error && (
          <div className="Error" id={errorId}>
            {error}
          </div>
        )}
      </Field>
    );
  }
);

SearchField.displayName = 'SearchField';

export default SearchField;

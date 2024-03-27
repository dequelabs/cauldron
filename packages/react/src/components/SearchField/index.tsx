import React, {
  useState,
  useRef,
  ChangeEvent,
  InputHTMLAttributes,
  forwardRef
} from 'react';
import classNames from 'classnames';
import { useId } from 'react-id-generator';

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
  trailingChildren?: React.ReactNode;
}

const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      className,
      label,
      defaultValue = '',
      onChange,
      hideLabel = false,
      placeholder = 'Search...',
      isForm = true,
      id: propId,
      value: propValue,
      trailingChildren,
      ...inputProps
    }: SearchFieldProps,
    ref
  ) => {
    const isControlled = typeof propValue !== 'undefined';

    const [value, setValue] = useState<string | undefined>(
      isControlled ? propValue : defaultValue
    );

    const [id] = propId ? [propId] : useId(1, 'search-field');
    const inputId = useRef(id).current;

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
          className={classNames(className, {
            'TextFieldWrapper--disabled': inputProps.disabled
          })}
        >
          <Icon type="magnifying-glass" className="SearchField__search-icon" />
          <input
            id={inputId}
            value={isControlled ? propValue : value}
            onChange={handleChange}
            placeholder={placeholder}
            ref={ref}
            {...inputProps}
            type="search"
          />
          {trailingChildren}
        </TextFieldWrapper>
      </Field>
    );
  }
);

SearchField.displayName = 'SearchField';

export default SearchField;

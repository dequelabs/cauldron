import React, {
  useState,
  useRef,
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  ForwardRefRenderFunction
} from 'react';
import classNames from 'classnames';
import { useId } from 'react-id-generator';

import TextFieldWrapper from '../internal/TextFieldWrapper';
import Offscreen from '../Offscreen';
import Icon from '../Icon';

interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  hideLabel?: boolean;
  isForm?: boolean;
}

const SearchFieldComponent: ForwardRefRenderFunction<
  HTMLInputElement,
  SearchFieldProps
> = (
  {
    label,
    defaultValue = '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange = () => {},
    hideLabel = false,
    placeholder = 'Search...',
    isForm = true,
    id: propId,
    value: propValue,
    ...otherProps
  },
  ref
) => {
  const [value, setValue] = useState<string | undefined>(
    typeof propValue !== 'undefined' ? propValue : defaultValue
  );

  const [id] = propId ? [propId] : useId(1, 'search-field');
  const inputId = useRef(id).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (typeof onChange === 'function') {
      onChange(newValue, e);
    }

    const isControlled = typeof propValue !== 'undefined';

    if (isControlled) {
      return;
    }

    setValue(newValue);
  };

  const Field = isForm ? 'form' : 'div';

  return (
    <Field
      role={isForm ? 'search' : undefined}
      className="SearchField"
      aria-labelledby={`${inputId}-label`}
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
          'TextFieldWrapper--disabled': otherProps.disabled
        })}
      >
        <Icon
          type="magnifying-glass"
          aria-hidden="true"
          className="Field__search-icon"
        />
        <input
          id={inputId}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          ref={ref}
          {...otherProps}
          className={classNames(otherProps.className, 'Field__text-input')}
          type="search"
        />
      </TextFieldWrapper>
    </Field>
  );
};

const SearchField = forwardRef(SearchFieldComponent);
SearchField.displayName = 'SearchField';
export default SearchField;

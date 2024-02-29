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

import TextFieldWrapper from '../internal/TextFieldWrapper';
import randomId from '../../utils/rndid';
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

const SearchField: ForwardRefRenderFunction<
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
    id,
    value: propsValue,
    ...otherProps
  },
  ref
) => {
  const [value, setValue] = useState<string | undefined>(
    typeof propsValue !== 'undefined' ? propsValue : defaultValue
  );
  const inputId = useRef(id || randomId()).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue, e);
    }

    if (typeof propsValue === 'undefined') {
      setValue(newValue);
    }
  };

  const Field = isForm ? 'form' : 'div';

  return (
    <Field role={isForm ? 'search' : undefined} className="Field__wrapper">
      <label className={'Field__label'} htmlFor={inputId}>
        {hideLabel ? <Offscreen>{label}</Offscreen> : <span>{label}</span>}
      </label>
      <TextFieldWrapper
        className={
          otherProps.disabled ? 'TextFieldWrapper--disabled' : undefined
        }
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

export default forwardRef(SearchField);

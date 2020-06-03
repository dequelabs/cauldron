import React from 'react';
import { SelectOption, SelectProps } from './interfaces';

export { SelectProps };

const Select = ({
  options,
  children,
  disabled,
  className = '',
  ...rest
}: SelectProps): React.ReactElement<HTMLSelectElement> => {
  if (options && children) {
    console.error(
      'The Select component only takes the options props or child option elements, not both.'
    );
  }
  return (
    <div
      className={`Field__select ${disabled ? 'Field__select--disabled' : ''}`}
    >
      <select className={`${className}`} disabled={disabled} {...rest}>
        {options?.length
          ? options.map(
              (
                option: SelectOption,
                index: number
              ): React.ReactElement<HTMLOptionElement> => {
                // TODO: possibly create an Deque option component
                return (
                  <option
                    className="Field__option"
                    key={index}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label || option.value}
                  </option>
                );
              }
            )
          : children}
      </select>
    </div>
  );
};

export default Select;

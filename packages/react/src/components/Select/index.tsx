import React from 'react';
import classNames from 'classnames';
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
      className={classNames('Field__select', {
        'Field__select--disabled': disabled
      })}
    >
      <select className={className} disabled={disabled} {...rest}>
        {options?.length
          ? options.map(
              (
                option: SelectOption,
                index: number
              ): React.ReactElement<HTMLOptionElement> => {
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

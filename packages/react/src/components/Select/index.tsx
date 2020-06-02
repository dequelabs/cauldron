import React from 'react';
import assert from 'assert';
import { SelectOption, SelectProps } from './interfaces';

export { SelectProps };

const Select = ({
  options,
  children,
  className,
  ...rest
}: SelectProps): React.ReactElement<HTMLSelectElement> => {
  assert(
    !(options && children),
    'You may only nest children or use the options prop, not both.'
  );
  return (
    <select className={`${className} Field__select`} {...rest}>
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
  );
};

export default Select;

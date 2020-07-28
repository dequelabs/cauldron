import React from 'react';
import uid from '../../utils/rndid';
import classNames from 'classnames';

export interface SelectOption {
  key: string;
  value: string;
  disabled?: boolean;
  label?: React.ReactNode;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options?: SelectOption[];
  children?: React.ReactElement<HTMLOptionElement | HTMLOptGroupElement>[];
}

const Select = ({
  options,
  children,
  disabled,
  label,
  id,
  required,
  ...rest
}: SelectProps): React.ReactElement<HTMLSelectElement> => {
  if (options && children) {
    console.error(
      'The Select component only takes the options props or child option elements, not both.'
    );
  }
  const selectId = id || uid();
  return (
    <div className="Field__select">
      <div className="Field__select--label-wrapper">
        <label htmlFor={selectId} className="Field__label">
          {label}
        </label>
      </div>
      <div
        className={classNames('Field__select--wrapper', {
          'Field__select--disabled': disabled
        })}
      >
        <select id={selectId} disabled={disabled} required={required} {...rest}>
          {options?.length
            ? options.map(
                (
                  option: SelectOption
                ): React.ReactElement<HTMLOptionElement> => {
                  return (
                    <option
                      className="Field__option"
                      key={option.key}
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
        <div className="arrow-down"></div>
      </div>
    </div>
  );
};

export default Select;

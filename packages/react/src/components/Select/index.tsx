import React, { Ref, useEffect, useState } from 'react';
import uid from '../../utils/rndid';
import classNames from 'classnames';
import tokenList from '../../utils/token-list';

export interface SelectOption {
  key: string;
  value: string;
  disabled?: boolean;
  label?: React.ReactNode;
}

export interface SelectProps
  extends Omit<React.HTMLProps<HTMLSelectElement>, 'children'> {
  label: string;
  requiredText?: string;
  error?: string;
  options?: SelectOption[];
  children?: React.ReactElement<HTMLOptionElement | HTMLOptGroupElement>[];
  value?: any;
  defaultValue?: any;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = React.forwardRef(
  (
    {
      options,
      children,
      disabled,
      label,
      id,
      required,
      requiredText = 'Required',
      error,
      value,
      'aria-describedby': ariaDescribedby,
      defaultValue,
      onChange,
      ...rest
    }: SelectProps,
    ref: Ref<HTMLSelectElement>
  ): React.ReactElement<HTMLSelectElement> => {
    if (options && children) {
      console.error(
        'The Select component only takes the options props or child option elements, not both.'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onChangeEvent = onChange ?? ((): void => {});
    const isControlled = typeof value !== 'undefined';
    const [currentValue, setCurrentValue] = useState(
      value || defaultValue || ''
    );

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChangeEvent(e);

      if (isControlled) {
        return;
      }

      setCurrentValue(e.target.value);
    };

    useEffect(() => {
      if (typeof value === 'undefined') {
        return;
      }

      // handle the incoming value change for controlled <Selects />
      setCurrentValue(value);
    }, [value]);

    const selectId = id || uid();
    const errorId = uid();

    const dynamicProps: {
      value?: any;
      defaultValue?: any;
      'aria-describedby'?: string;
    } = {};

    if (isControlled) {
      dynamicProps.value = currentValue;
    } else if (typeof defaultValue !== 'undefined') {
      dynamicProps.defaultValue = defaultValue;
    }

    if (error) {
      dynamicProps['aria-describedby'] = tokenList(errorId, ariaDescribedby);
    }

    // In order to support controlled selects, we
    // have to attach an `onChange` to the select.
    /* eslint-disable jsx-a11y/no-onchange */
    return (
      <div className="Field__select">
        <label
          htmlFor={selectId}
          className={classNames('Field__label', {
            'Field__label--is-required': !!required,
            'Field__label--has-error': !!error
          })}
        >
          <span>{label}</span>
          {required && (
            <span className="Field__required-text">{requiredText}</span>
          )}
        </label>
        <div
          className={classNames('Field__select--wrapper', {
            'Field__select--disabled': disabled,
            'Field--has-error': !!error
          })}
        >
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            {...dynamicProps}
            {...rest}
          >
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
          <div className="arrow-down" />
        </div>
        <div className="Error" id={errorId}>
          {error}
        </div>
      </div>
    );
    /* eslint-disable jsx-a11y/no-onchange */
  }
);

Select.displayName = 'Select';

export default Select;

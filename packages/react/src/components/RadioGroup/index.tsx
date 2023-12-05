import React, { Ref, useState, useRef, useEffect, forwardRef } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';

export interface RadioItem extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  value?: string;
  labelDescription?: React.ReactNode;
}

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name?: string;
  className?: string;
  radios: RadioItem[];
  defaultValue?: string;
  value?: any;
  inline?: boolean;
  onChange?: (radio: RadioItem, input: HTMLElement) => void;
  hasLabel?: never;
}

const RadioGroup = forwardRef(
  (
    {
      name,
      radios,
      defaultValue,
      value,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange = () => {},
      className,
      inline = false,
      ...other
    }: RadioGroupProps,
    ref: Ref<HTMLDivElement>
  ) => {
    const [currentValue, setCurrentValue] = useState<string | null>(
      value || defaultValue || null
    );
    const [focusIndex, setFocusIndex] = useState<number | null>(null);
    const inputs = useRef<HTMLInputElement[]>([]);
    const handleChange = (value: any) => setCurrentValue(value);
    const onRadioFocus = (index: number) => setFocusIndex(index);
    const onRadioBlur = () => setFocusIndex(null);
    const onRadioClick = (index: number) => {
      const radio = inputs.current?.[index];

      if (!radio) {
        return;
      }

      radio.click();
      radio.focus();
    };

    useEffect(() => {
      if (typeof value === 'undefined') {
        return;
      }

      setCurrentValue(value);
    }, [value]);

    const radioButtons = radios.map((radio, index) => {
      const {
        label,
        disabled,
        value: radioValue,
        labelDescription,
        id,
        className,
        ...other
      } = radio;
      const isChecked = currentValue === radioValue;
      const isFocused = focusIndex === index;

      return (
        <div className="Radio__wrap" key={id}>
          <div className={classNames('Radio is--flex-row', className)}>
            <input
              type="radio"
              name={name}
              value={radioValue}
              id={id}
              ref={(input) => {
                if (!input) {
                  return;
                }

                inputs.current.push(input);
              }}
              onFocus={() => onRadioFocus(index)}
              onBlur={() => onRadioBlur()}
              onChange={() => {
                handleChange(radioValue);
                onChange(radio, inputs.current?.[index]);
              }}
              disabled={disabled}
              checked={isChecked}
              aria-describedby={labelDescription ? `${id}Desc` : undefined}
              {...other}
            />
            <label
              htmlFor={id}
              className={classNames('Field__label Radio__label', {
                'Field__label--disabled': disabled
              })}
            >
              {label}
            </label>
            <Icon
              className={classNames('Radio__overlay', {
                'Radio__overlay--focused': isFocused,
                'Radio__overlay--disabled': disabled
              })}
              type={isChecked ? 'radio-checked' : 'radio-unchecked'}
              aria-hidden="true"
              onClick={() => onRadioClick(index)}
            />
          </div>
          {labelDescription && (
            <span
              id={`${id}Desc`}
              className={classNames('Field__labelDescription', {
                'Field__labelDescription--disabled': disabled
              })}
            >
              {labelDescription}
            </span>
          )}
        </div>
      );
    });

    // reset the input refs array
    // refs get clobbered every re-render anyway and this supports "dynamic" radios
    // (changing the number of radio buttons for example)
    inputs.current = [];

    return (
      <div
        className={classNames(className, { 'Radio--inline': inline })}
        role="radiogroup"
        ref={ref}
        {...other}
      >
        {radioButtons}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;

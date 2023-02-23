import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

export interface RadioItem extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  value?: string;
  labelDescription?: React.ReactNode;
}

export interface RadioGroupProps {
  name?: string;
  className?: string;
  radios: RadioItem[];
  defaultValue?: string;
  value?: any;
  onChange: (radio: RadioItem, input: HTMLElement) => void;
}

const RadioGroup = ({
  name,
  radios,
  defaultValue,
  value,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = () => {},
  className,
  ...other
}: RadioGroupProps) => {
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
    const isFocused = focusIndex === index;

    return (
      <div className={classNames('Radio is--flex-row', className)} key={id}>
        <input
          type="radio"
          name={name}
          value={radioValue}
          id={id}
          ref={input => {
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
          checked={currentValue === radioValue}
          aria-describedby={labelDescription ? `${id}Desc` : undefined}
          key={`input-${index}-${currentValue}`}
          {...other}
        />
        <label
          htmlFor={id}
          className={classNames('Field__label', {
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
          type={
            currentValue === radioValue ? 'radio-checked' : 'radio-unchecked'
          }
          aria-hidden="true"
          onClick={() => onRadioClick(index)}
        />
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

  // Hack to prevent ESLint from erroring about this variable not
  // being used. We want to pull it from `props` to ensure it's
  // not passed through to the radiogroup element.
  void defaultValue;

  // reset the input refs array
  // refs get clobbered every re-render anyway and this supports "dynamic" radios
  // (changing the number of radio buttons for example)
  inputs.current = [];

  return (
    <div className={className} role="radiogroup" {...other}>
      {radioButtons}
    </div>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string,
  radios: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      labelDescription: PropTypes.string
    })
  ).isRequired,
  hasLabel: (
    props: { [key: string]: string },
    propName: string,
    componentName: string
  ) => {
    if (!props['aria-label'] && !props['aria-labelledby']) {
      return new Error(
        `${componentName} must have an "aria-label" or "aria-labelledby" prop`
      );
    }
  },
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func
};

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;

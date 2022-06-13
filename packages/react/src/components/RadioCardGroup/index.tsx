import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon, { IconType } from '../Icon';
import Card, { CardContent } from '../Card';

export interface RadioItem extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  cardImg: JSX.Element;
  cardIcon: IconType;
  value?: string;
}

export interface RadioCardGroupProps {
  name?: string;
  className?: string;
  radios: RadioItem[];
  defaultValue?: string;
  value?: any;
  onChange: (radio: RadioItem, input: HTMLElement) => void;
}

const RadioCardGroup = ({
  name,
  radios,
  defaultValue,
  value,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = () => {},
  className,
  ...other
}: RadioCardGroupProps) => {
  const [currentValue, setCurrentValue] = useState<string>(
    value ?? defaultValue
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
      cardImg,
      cardIcon,
      id,
      className,
      ...other
    } = radio;
    const isChecked = currentValue === radioValue;
    const isFocused = focusIndex === index;

    return (
      <div className={classNames('RadioCard')} key={index}>
        <Card
          variant="simple"
          className={classNames('RadioCardGroup__Card RadioCard__overlay', {
            'RadioCard__overlay--focused': isFocused,
            'RadioCard__overlay--checked': isChecked,
            'RadioCard__overlay--disabled': disabled
          })}
          onClick={() => onRadioClick(index)}
        >
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
            checked={isChecked}
            {...other}
          />
          <CardContent>
            <div className={classNames('RadioCardGroup__Checked')}>
              {isChecked && (
                <Icon
                  className={classNames('RadioCardGroup__Icon')}
                  type={cardIcon}
                />
              )}
            </div>

            <div className={classNames('RadioCardGroup__Base')}>
              <div className={classNames('RadioCardGroup__Image')}>
                {cardImg}
              </div>
              <label
                htmlFor={id}
                className={classNames('RadioCardGroup__Label')}
              >
                {label}
              </label>
            </div>
          </CardContent>
        </Card>
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
    <div className={classNames('RadioCardGroup')} role="radiogroup" {...other}>
      {radioButtons}
    </div>
  );
};

RadioCardGroup.propTypes = {
  name: PropTypes.string,
  radios: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      cardImg: PropTypes.element.isRequired,
      cardIcon: PropTypes.string.isRequired
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

RadioCardGroup.displayName = 'RadioCardGroup';

export default RadioCardGroup;

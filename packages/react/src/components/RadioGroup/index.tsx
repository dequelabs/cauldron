import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface RadioItem extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export interface RadioGroupProps {
  name: string;
  className?: string;
  radios: RadioItem[];
  defaultValue?: string;
  onChange: (radio: RadioItem, input: HTMLElement) => void;
}

interface RadioGroupState {
  value: any;
  focusIndex?: number | null;
}

export default class RadioGroup extends React.Component<
  RadioGroupProps,
  RadioGroupState
> {
  static defaultProps = {
    className: '',
    defaultValue: null,
    onChange: () => {}
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    radios: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
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

  private inputs: HTMLInputElement[] = [];
  private handleChange = (value: any) => this.setState({ value });
  private onRadioFocus = (focusIndex: number) => this.setState({ focusIndex });
  private onRadioBlur = () => this.setState({ focusIndex: null });
  private onRadioClick = (i: number) => {
    const radio = this.inputs[i];
    if (!radio) {
      return;
    }
    radio.click();
    radio.focus();
  };

  constructor(props: RadioGroupProps) {
    super(props);
    this.state = { value: this.props.defaultValue };
  }

  render() {
    this.inputs = [];
    const {
      name,
      className,
      defaultValue,
      onChange,
      radios,
      ...other
    } = this.props;

    // Hack to prevent ESLint from erroring about this variable not
    // being used. We want to pull it from `props` to ensure it's
    // not passed through to the `<input/>`.
    void defaultValue;

    const radioButtons = radios.map((radio, index) => {
      const { label, disabled, value, id, className, ...other } = radio;
      const isChecked = this.state.value === value;
      const isFocused = this.state.focusIndex === index;

      return (
        <div
          className={classNames('dqpl-radio-wrap dqpl-flexr', className)}
          key={id}
        >
          <input
            type="radio"
            name={name}
            value={value}
            id={id}
            ref={input => (this.inputs[index] = input as HTMLInputElement)}
            onFocus={() => this.onRadioFocus(index)}
            onBlur={() => this.onRadioBlur()}
            onChange={() => {
              this.handleChange(value);
              onChange(radio, this.inputs[index]);
            }}
            disabled={disabled}
            checked={isChecked}
            {...other}
          />
          <div
            aria-hidden="true"
            className={classNames('dqpl-radio dqpl-overlay-radio fa', {
              'fa-dot-circle-o': isChecked,
              'fa-circle-o': !isChecked,
              'dqpl-radio-focused': isFocused,
              'dqpl-radio-disabled': disabled
            })}
            onClick={() => this.onRadioClick(index)}
          />
          <label
            htmlFor={id}
            className={classNames('dqpl-label', {
              'dqpl-label-disabled': disabled
            })}
          >
            {label}
          </label>
        </div>
      );
    });

    return (
      <div
        className={classNames('dqpl-radio-group', className)}
        role="radiogroup"
        {...other}
      >
        {radioButtons}
      </div>
    );
  }
}

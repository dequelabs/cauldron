import React, { ChangeEvent } from 'react';
import classNames from 'classnames';

import setRef from '../../utils/setRef';
import Offscreen from '../Offscreen';
import randomId from '../../utils/rndid';
import TextFieldWrapper from '../internal/TextFieldWrapper';
import Icon from '../Icon';

export interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: React.ReactNode;
  defaultValue?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldRef?: React.Ref<HTMLInputElement>;
  hideLabel?: boolean;
  field?: boolean;
}

interface SearchFieldState {
  value: string | number | string[] | undefined;
}

export default class SearchField extends React.Component<
  SearchFieldProps,
  SearchFieldState
> {
  static displayName = 'SearchField';
  static defaultProps = {
    defaultValue: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fieldRef: () => {},
    hideLabel: false,
    placeholder: 'Search...',
    field: true
  };

  private inputId: string;
  private input: HTMLInputElement | null;

  constructor(props: SearchFieldProps) {
    super(props);
    this.inputId = this.props.id || randomId();
    this.state = {
      value:
        typeof this.props.value !== 'undefined'
          ? (this.props.value as string)
          : this.props.defaultValue || ''
    };
    this.onChange = this.onChange.bind(this);
  }

  render() {
    const isRequired = !!this.props.required;
    // disabling `no-unused-vars` to prevent specific
    // props from being passed through to the input
    const {
      label,
      fieldRef,
      value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onChange,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      defaultValue,
      hideLabel,
      placeholder,
      field,
      'aria-describedby': ariaDescribedby,
      className,
      disabled,
      ...other
    } = this.props;

    const Field = field ? 'form' : 'div';

    return (
      <Field role={field ? 'search' : ''} className="Field__wrapper">
        <label
          className={classNames('Field__label', {
            'Field__label--is-required': isRequired
          })}
          htmlFor={this.inputId}
        >
          {hideLabel ? <Offscreen>{label}</Offscreen> : <span>{label}</span>}
        </label>
        <TextFieldWrapper
          className={disabled ? 'TextFieldWrapper--disabled' : undefined}
        >
          <Icon type="magnifying-glass" className="Field__search-icon" />
          <input
            type="search"
            className={classNames(className, 'Field__text-input')}
            id={this.inputId}
            aria-describedby={ariaDescribedby}
            disabled={disabled}
            value={typeof value !== 'undefined' ? value : this.state.value}
            onChange={this.onChange}
            placeholder={placeholder}
            ref={(input: HTMLInputElement | null) => {
              this.input = input;
              setRef(fieldRef, input);
            }}
            {...other}
          />
        </TextFieldWrapper>
      </Field>
    );
  }

  onChange(e: ChangeEvent<HTMLInputElement>) {
    if (this.props.onChange) {
      this.props.onChange(
        this.input?.value || /* istanbul ignore next: default value */ '',
        e
      );
    }

    if (typeof this.props.value !== 'undefined') {
      return;
    }

    this.setState({
      value: this.input?.value
    });
  }
}

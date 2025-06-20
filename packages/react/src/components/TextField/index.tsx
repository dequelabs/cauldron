import React, { ChangeEvent } from 'react';
import classNames from 'classnames';
import rndid from '../../utils/rndid';
import setRef from '../../utils/setRef';
import { addIdRef } from '../../utils/idRefs';

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  defaultValue?: string;
  onChange?: (
    value: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  fieldRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  requiredText?: string;
  multiline?: boolean;
}

interface TextFieldState {
  value: string | number | string[] | undefined;
}

export default class TextField extends React.Component<
  TextFieldProps,
  TextFieldState
> {
  static displayName = 'TextField';
  static defaultProps = {
    error: null,
    required: false,
    defaultValue: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fieldRef: () => {},
    requiredText: 'Required',
    multiline: false
  };

  private inputId: string;
  private errorId: string;
  private descriptionId: string;
  private input: HTMLInputElement | HTMLTextAreaElement | null;

  constructor(props: TextFieldProps) {
    super(props);
    this.inputId = this.props.id || rndid();
    this.errorId = rndid();
    this.descriptionId = rndid();
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
      description,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onChange,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      defaultValue,
      error = null,
      requiredText,
      multiline,
      'aria-describedby': ariaDescribedby,
      children,
      className,
      ...other
    } = this.props;
    // typescript can't infer the type so it's complaining about
    // textarea and input props being incompatible
    // we should probably fix this
    const Field: any = multiline ? 'textarea' : 'input';
    const ariaDescribedbyWithDescription = description
      ? addIdRef(ariaDescribedby, this.descriptionId)
      : ariaDescribedby;

    const inputProps = {
      'aria-describedby': error
        ? addIdRef(ariaDescribedbyWithDescription, this.errorId)
        : ariaDescribedbyWithDescription
    };

    return (
      <div className="Field">
        <label
          className={classNames('Field__label', {
            'Field__label--is-required': isRequired,
            'Field__label--has-error': error
          })}
          htmlFor={this.inputId}
        >
          <span>{label}</span>
          {isRequired && (
            <span className="Field__required-text" aria-hidden="true">
              {requiredText}
            </span>
          )}
        </label>
        {description && (
          <div className="Field__description" id={this.descriptionId}>
            {description}
          </div>
        )}
        <Field
          className={classNames(className, {
            'Field__text-input': !multiline,
            Field__textarea: multiline,
            'Field--has-error': error
          })}
          id={this.inputId}
          value={typeof value !== 'undefined' ? value : this.state.value}
          onChange={this.onChange}
          aria-invalid={!!error}
          ref={(input: HTMLInputElement | HTMLTextAreaElement | null) => {
            this.input = input;
            setRef(fieldRef, input);
          }}
          {...other}
          {...inputProps}
        />
        {error && (
          <div className="Error" id={this.errorId}>
            {error}
          </div>
        )}
      </div>
    );
  }

  onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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

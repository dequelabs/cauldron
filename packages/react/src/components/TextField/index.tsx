import React, { ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import rndid from '../../utils/rndid';
import tokenList from '../../utils/token-list';
import setRef from '../../utils/setRef';

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: React.ReactNode;
  error?: React.ReactNode;
  defaultValue?: string;
  onChange: (
    value: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  fieldRef: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
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
  static defaultProps = {
    error: null,
    required: false,
    defaultValue: null,
    onChange: () => {},
    fieldRef: () => {},
    requiredText: 'Required',
    multiline: false
  };

  static propTypes = {
    label: PropTypes.node.isRequired,
    id: PropTypes.string,
    error: PropTypes.node,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    fieldRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    required: PropTypes.bool,
    requiredText: PropTypes.string, // support localized required text
    multiline: PropTypes.bool,
    'aria-describedby': PropTypes.string
  };

  private inputId: string;
  private errorId: string;
  private input: HTMLInputElement | HTMLTextAreaElement | null;

  constructor(props: TextFieldProps) {
    super(props);
    this.inputId = this.props.id || rndid();
    this.errorId = rndid();
    this.state = {
      value:
        typeof this.props.value !== 'undefined'
          ? this.props.value
          : this.props.defaultValue || ''
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps: TextFieldProps) {
    const { value } = this.props;

    if (value === prevProps.value) {
      return;
    }

    this.setState({ value });
  }

  render() {
    const isRequired = !!this.props.required;
    // disabling `no-unused-vars` to prevent specific
    // props from being passed through to the input
    const {
      label,
      fieldRef,
      // eslint-disable-next-line no-unused-vars
      value,
      // eslint-disable-next-line no-unused-vars
      onChange,
      // eslint-disable-next-line no-unused-vars
      defaultValue,
      error = null,
      requiredText,
      multiline,
      'aria-describedby': ariaDescribedby,
      ...other
    } = this.props;
    // typescript can't infer the type so it's complaining about
    // textarea and input props being incompatible
    // we should probably fix this
    const Field: any = multiline ? 'textarea' : 'input';
    const inputProps = {
      'aria-describedby': error
        ? tokenList(this.errorId, ariaDescribedby)
        : ariaDescribedby
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
            <span className="Field__required-text">{requiredText}</span>
          )}
        </label>
        <Field
          className={classNames({
            'Field__text-input': !multiline,
            Field__textarea: multiline,
            'Field--has-error': error
          })}
          id={this.inputId}
          value={this.state.value}
          onChange={this.onChange}
          aria-invalid={!!error}
          ref={(input: HTMLInputElement | HTMLTextAreaElement | null) => {
            this.input = input;
            setRef(fieldRef, input);
          }}
          {...other}
          {...inputProps}
        />
        <div className="Error" id={this.errorId}>
          {error}
        </div>
      </div>
    );
  }

  onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.props.onChange(this.input?.value || '', e);
    if (typeof this.props.value !== 'undefined') {
      return;
    }

    this.setState({
      value: this.input?.value
    });
  }
}

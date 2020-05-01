import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import setRef from '../../utils/setRef';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  name: string;
  label: React.ReactNode;
  value: string;
  checked: boolean;
  onChange: (e: React.FormEvent<HTMLInputElement>, checked: boolean) => void;
  checkboxRef: React.Ref<HTMLInputElement>;
}

interface CheckboxState {
  checked: boolean;
  focused: boolean;
}

export default class Checkbox extends React.Component<
  CheckboxProps,
  CheckboxState
> {
  private checkbox: HTMLInputElement | null;

  static defaultProps = {
    checked: false,
    disabled: false,
    onChange: () => {},
    checkboxRef: () => {}
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    checkboxRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ])
  };

  static displayName = 'Checkbox';

  constructor(props: CheckboxProps) {
    super(props);
    this.state = { checked: this.props.checked, focused: false };
    this.toggleFocus = this.toggleFocus.bind(this);
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
  }

  componentDidUpdate(prevProps: CheckboxProps) {
    const { checked } = this.props;

    if (checked !== prevProps.checked) {
      this.setState({ checked });
    }
  }

  toggleFocus() {
    this.setState({ focused: !this.state.focused });
  }

  onCheckboxClick(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = !this.state.checked;
    this.setState({ checked });
    this.props.onChange(e, checked);
  }

  onOverlayClick() {
    this.checkbox?.click();
    this.checkbox?.focus();
  }

  render() {
    const { checked, focused } = this.state;
    // disabling no-unused-vars below to prevent specific
    // props from being passed through to the wrapper
    const {
      id,
      value,
      name,
      label,
      disabled,
      className,
      // eslint-disable-next-line no-unused-vars
      onChange,
      // eslint-disable-next-line no-unused-vars
      checkboxRef,
      ...others
    } = this.props;

    return (
      <div
        className={classNames('dqpl-checkbox-wrap dqpl-flexr', className)}
        {...others}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={this.onCheckboxClick}
          disabled={disabled}
          name={name}
          id={id}
          value={value}
          onFocus={this.toggleFocus}
          onBlur={this.toggleFocus}
          ref={checkbox => {
            this.checkbox = checkbox;
            setRef(this.props.checkboxRef, checkbox);
          }}
        />
        <div
          aria-hidden="true"
          className={classNames('dqpl-checkbox dqpl-overlay-checkbox fa', {
            'fa-square-o': !checked,
            'fa-check-square': checked,
            'dqpl-checkbox-disabled': disabled,
            'dqpl-checkbox-focused': focused
          })}
          onClick={this.onOverlayClick}
        />
        <label
          className={classNames('dqpl-label', {
            'dqpl-label-disabled': disabled
          })}
          htmlFor={id}
        >
          {label}
        </label>
      </div>
    );
  }
}

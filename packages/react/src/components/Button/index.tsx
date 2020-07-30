import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'link';
  buttonRef?: React.Ref<HTMLButtonElement>;
  disabled?: boolean; // todo, investigate why disabled is needed
  thin?: boolean;
}

export default class Button extends React.Component<ButtonProps> {
  static defaultProps = {
    variant: 'primary',
    buttonRef: () => {}
  };

  static propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'error', 'link']),
    children: PropTypes.node,
    className: PropTypes.string,
    buttonRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ])
  };

  static displayName = 'Button';

  render() {
    const {
      variant,
      children,
      className,
      buttonRef,
      thin,
      ...other
    } = this.props;
    return (
      <button
        type={'button'}
        className={classNames(className, {
          'Button--primary': variant === 'primary',
          'Button--secondary': variant === 'secondary',
          'Button--error': variant === 'error',
          Link: variant === 'link',
          'Button--thin': thin
        })}
        ref={buttonRef}
        {...other}
      >
        {children}
      </button>
    );
  }
}

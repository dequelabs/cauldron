import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import AriaIsolate from '../../utils/aria-isolate';
import { typeMap, tabIndexHandler } from './utils';
import setRef from '../../utils/setRef';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'confirmation' | 'caution' | 'error' | 'action-needed' | 'info';
  onDismiss: () => void;
  dismissText?: string;
  toastRef: React.Ref<HTMLDivElement>;
  focus?: boolean;
  show?: boolean;
  dismissible?: boolean;
  children: React.ReactNode;
}

interface ToastState {
  animationClass: string;
  isolator?: AriaIsolate;
}

/**
 * The cauldron toast notification component
 */
export default class Toast extends React.Component<ToastProps, ToastState> {
  static defaultProps = {
    dismissText: 'Dismiss',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDismiss: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toastRef: () => {},
    focus: true,
    show: false,
    dismissible: true
  };

  static displayName = 'Toast';

  private el: HTMLDivElement | null;

  constructor(props: ToastProps) {
    super(props);

    this.state = {
      animationClass: props.show ? 'FadeIn--flex' : 'is--hidden'
    };

    this.dismissToast = this.dismissToast.bind(this);
    this.showToast = this.showToast.bind(this);
  }

  componentDidMount() {
    const { show } = this.props;

    if (show) {
      // Timeout because CSS display: none/block and opacity:
      // 0/1 properties cannot be toggled in the same tick
      // see: https://codepen.io/isnerms/pen/eyQaLP
      setTimeout(this.showToast);
    }
  }

  componentDidUpdate(prevProps: ToastProps) {
    const { show } = this.props;
    if (prevProps.show !== show) {
      if (show) {
        this.setState({ animationClass: 'FadeIn--flex' }, () => {
          setTimeout(this.showToast);
        });
      } else {
        this.dismissToast();
      }
    }
  }

  componentWillUnmount() {
    const { isolator } = this.state;
    isolator?.deactivate();
  }

  render() {
    const { animationClass } = this.state;
    const {
      type,
      children,
      // prevent `onDismiss` from being passed-through to DOM
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onDismiss,
      dismissText,
      toastRef,
      focus,
      show,
      dismissible,
      className,
      ...otherProps
    } = this.props;
    const scrim =
      type === 'action-needed' && show ? (
        <div className="Scrim--light Scrim--show Scrim--fade-in" />
      ) : null;

    const defaultProps: React.HTMLAttributes<HTMLDivElement> = {
      tabIndex: -1,
      className: classNames(
        'Toast',
        `Toast--${typeMap[type].className}`,
        animationClass,
        { 'Toast--non-dismissible': !dismissible },
        className
      )
    };

    if (!focus) {
      defaultProps.role = 'alert';
    }

    return (
      <React.Fragment>
        <div
          ref={(el) => {
            this.el = el;
            setRef(toastRef, el);
          }}
          {...defaultProps}
          {...otherProps}
        >
          <div className="Toast__message">
            <Icon type={typeMap[type].icon} />
            <div className="Toast__message-content">{children}</div>
          </div>
          {type !== 'action-needed' && dismissible && (
            <button
              type="button"
              className={'Toast__dismiss'}
              aria-label={dismissText}
              onClick={this.dismissToast}
            >
              <Icon type="close" />
            </button>
          )}
        </div>
        {scrim}
      </React.Fragment>
    );
  }

  dismissToast() {
    if (!this.el) {
      return;
    }
    const { onDismiss, type } = this.props;
    const { isolator } = this.state;

    this.setState(
      {
        animationClass: 'FadeIn--flex'
      },
      () => {
        // Timeout because CSS display: none/block and opacity:
        // 0/1 properties cannot be toggled in the same tick
        // see: https://codepen.io/isnerms/pen/eyQaLP
        setTimeout(() => {
          if (type === 'action-needed') {
            tabIndexHandler(true, this.el);
            isolator?.deactivate();
          }

          this.setState({ animationClass: 'is--hidden' }, onDismiss);
        });
      }
    );
  }

  showToast() {
    const { type, focus } = this.props;

    this.setState(
      {
        animationClass: 'FadeIn--flex FadeIn'
      },
      () => {
        if (type === 'action-needed') {
          const isolator = new AriaIsolate(this.el as HTMLDivElement);
          tabIndexHandler(false, this.el);
          this.setState({ isolator });
          isolator.activate();
        }

        if (this.el && !!focus) {
          // focus the toast
          this.el.focus();
        }
      }
    );
  }
}

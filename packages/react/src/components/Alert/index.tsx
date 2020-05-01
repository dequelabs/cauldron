import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import Scrim from '../Scrim';
import AriaIsolate from '../../utils/aria-isolate';
import setRef from '../../utils/setRef';

const noop = () => {};
export const Actions = ({ children }: PropsWithChildren<{}>) => (
  <div className="dqpl-buttons">{children}</div>
);

export interface AlertProps {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  contentRef: React.Ref<HTMLDivElement>;
  alertRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
  forceAction: boolean;
}

interface AlertState {
  show: boolean;
  isolator?: AriaIsolate;
}

/**
 * Cauldron <Alert /> component
 */
export default class Alert extends React.Component<AlertProps, AlertState> {
  static defaultProps = {
    onClose: noop,
    forceAction: false,
    alertRef: noop,
    contentRef: noop
  };

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object
    ]).isRequired,
    show: PropTypes.bool,
    contentRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    alertRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    onClose: PropTypes.func,
    forceAction: PropTypes.bool
  };

  private content: HTMLDivElement | null;
  private element: HTMLDivElement | null;

  state: AlertState;

  constructor(props: AlertProps) {
    super(props);

    this.state = {
      show: props.show || false
    };

    this.close = this.close.bind(this);
    this.focusContent = this.focusContent.bind(this);
  }

  componentDidMount() {
    if (this.props.show) {
      this.attachIsolator(() => setTimeout(this.focusContent));
    }
  }

  componentDidUpdate(prevProps: AlertProps) {
    const showChange = prevProps.show !== this.props.show;

    if (!showChange) {
      return;
    }

    this.setState({ show: this.props.show || false }, () => {
      if (this.props.show) {
        this.attachIsolator(this.focusContent);
      } else {
        this.close();
      }
    });
  }

  private attachIsolator(done: () => void) {
    this.setState(
      {
        isolator: new AriaIsolate(this.element as HTMLElement)
      },
      done
    );
  }

  render() {
    const { show } = this.state;
    const { alertRef, contentRef, forceAction, className } = this.props;
    const cl = className || '';
    const alertClass = show ? 'dqpl-dialog-show' : '';

    if (!show) {
      return null;
    }

    return (
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.close,
          escapeDeactivates: !forceAction,
          fallbackFocus: '.dqpl-dialog-inner'
        }}
      >
        <div
          className={['dqpl-alert', alertClass, cl].join(' ')}
          role="alertdialog"
          ref={el => {
            this.element = el;
            setRef(alertRef, el);
          }}
        >
          <div
            className="dqpl-dialog-inner"
            ref={el => {
              this.content = el;
              setRef(contentRef, el);
            }}
            tabIndex={-1}
          >
            <div className="dqpl-content">{this.props.children}</div>
          </div>
          <Scrim show={show} />
        </div>
      </FocusTrap>
    );
  }

  close() {
    this.state.isolator?.deactivate();
    this.setState({ show: false });
    this.props.onClose();
  }

  focusContent() {
    if (this.content) {
      this.content.focus();
    }
    this.state.isolator?.activate();
  }
}

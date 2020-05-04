import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import Offscreen from '../Offscreen';
import Scrim from '../Scrim';
import ClickOutsideListener from '../ClickOutsideListener';
import AriaIsolate from '../../utils/aria-isolate';
import setRef from '../../utils/setRef';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  modalRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
  forceAction?: boolean;
  heading: {
    text: string;
    level?: number;
  };
  closeButtonText?: string;
}

interface ModalState {
  isolator?: AriaIsolate;
}

const noop = () => {};

// TODO: separate out common logic (some duplicate of <Alert />)
export default class Modal extends React.Component<ModalProps, ModalState> {
  static defaultProps = {
    onClose: noop,
    forceAction: false,
    closeButtonText: 'Close',
    modalRef: noop
  };

  static propTypes = {
    className: PropTypes.string,
    show: PropTypes.bool,
    modalRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    onClose: PropTypes.func,
    forceAction: PropTypes.bool,
    heading: PropTypes.object.isRequired,
    closeButtonText: PropTypes.string
  };

  private element: HTMLDivElement | null;
  private heading: HTMLHeadingElement | null;

  constructor(props: ModalProps) {
    super(props);

    this.close = this.close.bind(this);
    this.focusHeading = this.focusHeading.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    if (this.props.show) {
      this.attachIsolator(() => setTimeout(this.focusHeading));
    }
  }

  componentDidUpdate(prevProps: ModalProps) {
    if (!prevProps.show && this.props.show) {
      this.attachIsolator(this.focusHeading);
    } else if (prevProps.show && !this.props.show) {
      this.close();
    }
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
    const {
      modalRef,
      forceAction,
      className,
      children,
      closeButtonText,
      heading,
      show,
      ...other
    } = this.props;

    if (!show) {
      return null;
    }

    const close = !forceAction ? (
      <button
        className="dqpl-close dqpl-icon"
        type="button"
        onClick={this.close}
      >
        <div className="fa fa-close" aria-hidden="true" />
        <Offscreen>{closeButtonText}</Offscreen>
      </button>
    ) : null;
    const Heading = `h${heading.level || 2}` as 'h1';

    return (
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.close,
          escapeDeactivates: !forceAction,
          fallbackFocus: '.dqpl-modal-heading'
        }}
      >
        <ClickOutsideListener onClickOutside={this.handleClickOutside}>
          <div
            role="dialog"
            className={classNames('dqpl-modal', className, {
              'dqpl-dialog-show': show
            })}
            ref={el => {
              this.element = el;
              setRef(modalRef, el);
            }}
            {...other}
          >
            <div className="dqpl-dialog-inner">
              <div className="dqpl-modal-header">
                <Heading
                  className="dqpl-modal-heading"
                  ref={(el: HTMLHeadingElement) => (this.heading = el)}
                  tabIndex={-1}
                >
                  {heading.text}
                </Heading>
                {close}
              </div>
              {children}
            </div>
          </div>
        </ClickOutsideListener>
        <Scrim show={show} />
      </FocusTrap>
    );
  }

  close() {
    this.state.isolator?.deactivate();
    this.props.onClose();
  }

  handleClickOutside() {
    const { show, forceAction } = this.props;
    if (show && !forceAction) {
      this.close();
    }
  }

  focusHeading() {
    if (this.heading) {
      this.heading.focus();
    }
    this.state.isolator?.activate();
  }
}

const ModalContent = ({
  children,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="dqpl-content" {...other}>
    {children}
  </div>
);
ModalContent.displayName = 'ModalContent';

const ModalFooter = ({
  children,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="dqpl-modal-footer" {...other}>
    {children}
  </div>
);
ModalFooter.displayName = 'ModalFooter';

export { ModalContent, ModalFooter };

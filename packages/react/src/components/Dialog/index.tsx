import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import Offscreen from '../Offscreen';
import Icon from '../Icon';
import Scrim from '../Scrim';
import ClickOutsideListener from '../ClickOutsideListener';
import AriaIsolate from '../../utils/aria-isolate';
import setRef from '../../utils/setRef';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  dialogRef?: React.Ref<HTMLDivElement>;
  onClose: () => void;
  forceAction?: boolean;
  heading:
    | React.ReactElement<any>
    | {
        text: React.ReactElement<any>;
        level: number | undefined;
      };
  closeButtonText?: string;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
}

interface DialogState {
  isolator?: AriaIsolate;
}

const noop = () => {};

export default class Dialog extends React.Component<DialogProps, DialogState> {
  static defaultProps = {
    onClose: noop,
    forceAction: false,
    closeButtonText: 'Close'
  };

  static propTypes = {
    className: PropTypes.string,
    show: PropTypes.bool,
    dialogRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    onClose: PropTypes.func,
    forceAction: PropTypes.bool,
    heading: PropTypes.oneOfType([PropTypes.object, PropTypes.node]).isRequired,
    closeButtonText: PropTypes.string,
    portal: PropTypes.any
  };

  private element: HTMLDivElement | null;
  private heading: HTMLHeadingElement | null;

  constructor(props: DialogProps) {
    super(props);

    this.close = this.close.bind(this);
    this.focusHeading = this.focusHeading.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.show) {
      this.attachIsolator(() => setTimeout(this.focusHeading));
    }
  }

  componentDidUpdate(prevProps: DialogProps) {
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
      dialogRef,
      forceAction,
      className,
      children,
      closeButtonText,
      heading,
      show,
      portal = document.body,
      ...other
    } = this.props;

    if (!show) {
      return null;
    }

    const close = !forceAction ? (
      <button className="Dialog__close" type="button" onClick={this.close}>
        <Icon type="close" aria-hidden="true" />
        <Offscreen>{closeButtonText}</Offscreen>
      </button>
    ) : null;
    const Heading = `h${
      typeof heading === 'object' && 'level' in heading && !!heading.level
        ? heading.level
        : 2
    }` as 'h1';

    const Dialog = (
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.close,
          escapeDeactivates: !forceAction,
          fallbackFocus: '.Dialog__heading'
        }}
      >
        <ClickOutsideListener onClickOutside={this.handleClickOutside}>
          <div
            role="dialog"
            className={classNames('Dialog', className, {
              'Dialog--show': show
            })}
            ref={el => {
              this.element = el;
              if (!dialogRef) {
                return;
              }
              setRef(dialogRef, el);
            }}
            {...other}
          >
            <Scrim show={show} />
            <div className="Dialog__inner">
              <div className="Dialog__header">
                <Heading
                  className="Dialog__heading"
                  ref={(el: HTMLHeadingElement) => (this.heading = el)}
                  tabIndex={-1}
                >
                  {typeof heading === 'object' && 'text' in heading
                    ? heading.text
                    : heading}
                </Heading>
                {close}
              </div>
              {children}
            </div>
          </div>
        </ClickOutsideListener>
      </FocusTrap>
    );

    return createPortal(
      Dialog,
      ('current' in portal ? portal.current : portal) || document.body
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

const DialogContent = ({
  children,
  className,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('Dialog__content', className)} {...other}>
    {children}
  </div>
);
DialogContent.displayName = 'DialogContent';

const DialogFooter = ({
  children,
  className,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('Dialog__footer', className)} {...other}>
    {children}
  </div>
);
DialogFooter.displayName = 'DialogFooter';

export { Dialog, DialogContent, DialogFooter };

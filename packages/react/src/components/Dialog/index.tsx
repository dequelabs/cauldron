import React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import Offscreen from '../Offscreen';
import Icon from '../Icon';
import ClickOutsideListener from '../ClickOutsideListener';
import AriaIsolate from '../../utils/aria-isolate';
import setRef from '../../utils/setRef';
import nextId from 'react-id-generator';
import { isBrowser } from '../../utils/is-browser';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  dialogRef?: React.Ref<HTMLDivElement>;
  onClose?: () => void;
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

const noop = () => {
  //not empty
};

export default class Dialog extends React.Component<DialogProps, DialogState> {
  static defaultProps = {
    onClose: noop,
    forceAction: false,
    closeButtonText: 'Close'
  };

  private element: HTMLDivElement | null;
  private heading: HTMLHeadingElement | null;
  private headingId: string = nextId('dialog-title-');

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

  componentWillUnmount() {
    const { isolator } = this.state;
    isolator?.deactivate();
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
      ...other
    } = this.props;

    if (!show || !isBrowser()) {
      return null;
    }

    const portal = this.props.portal || document.body;

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
            ref={(el) => {
              this.element = el;
              if (!dialogRef) {
                return;
              }
              setRef(dialogRef, el);
            }}
            aria-labelledby={this.headingId}
            {...other}
          >
            <div className="Dialog__inner">
              <div className="Dialog__header">
                <Heading
                  className="Dialog__heading"
                  ref={(el: HTMLHeadingElement) => (this.heading = el)}
                  tabIndex={-1}
                  id={this.headingId}
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
    ) as JSX.Element;
  }

  close() {
    this.state.isolator?.deactivate();
    if (this.props.show) {
      this.props.onClose?.();
    }
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

interface DialogAlignmentProps {
  align?: 'left' | 'center' | 'right';
}

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement> &
  DialogAlignmentProps & { className?: string };

const DialogContent = ({
  children,
  className,
  align,
  ...other
}: DialogContentProps) => (
  <div
    className={classNames('Dialog__content', className, {
      'text--align-left': align === 'left',
      'text--align-center': align === 'center',
      'text--align-right': align === 'right'
    })}
    {...other}
  >
    {children}
  </div>
);
DialogContent.displayName = 'DialogContent';

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement> &
  DialogAlignmentProps & { className?: string };

const DialogFooter = ({
  children,
  className,
  align,
  ...other
}: DialogFooterProps) => (
  <div
    className={classNames('Dialog__footer', className, {
      'text--align-left': align === 'left',
      'text--align-center': align === 'center',
      'text--align-right': align === 'right'
    })}
    {...other}
  >
    {children}
  </div>
);
DialogFooter.displayName = 'DialogFooter';
export { Dialog, DialogContent, DialogFooter };

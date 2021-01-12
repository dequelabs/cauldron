import React, { ButtonHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import focusable from 'focusable';
import Icon from '../Icon';
import rndid from '../../utils/rndid';
import removeIds from '../../utils/remove-ids';

export interface PointoutProps {
  arrowPosition:
    | 'top-left'
    | 'top-right'
    | 'right-top'
    | 'right-bottom'
    | 'bottom-right'
    | 'bottom-left'
    | 'left-bottom'
    | 'left-top';
  heading?: React.ReactNode;
  className?: string;
  headerId: string;
  children: React.ReactNode;
  ftpoRef: React.Ref<HTMLDivElement>;
  noArrow?: boolean;
  onClose: () => void;
  dismissText?: string;
  nextText?: string;
  previousText?: string;
  showNext?: boolean;
  showPrevious?: boolean;
  disableOffscreenPointout?: boolean;
  target?: React.RefObject<HTMLElement> | HTMLElement;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
  previousButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  closeButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

interface PointoutState {
  show: boolean;
  style: React.CSSProperties;
  headingId?: string;
  offscreenContentFocus?: boolean;
}

export default class Pointout extends React.Component<
  PointoutProps,
  PointoutState
> {
  static defaultProps = {
    ftpoRef: () => {},
    noArrow: false,
    onClose: () => {},
    dismissText: 'dismiss',
    previousText: 'previous',
    nextText: 'next',
    arrowPosition: 'top-left'
  };

  static propTypes = {
    heading: PropTypes.node,
    children: PropTypes.node.isRequired,
    ftpRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    noArrow: function(props: PointoutProps, propName: keyof PointoutProps) {
      if (props[propName] === true && typeof props['target'] !== 'undefined') {
        return new Error(
          'A "target" prop with "noArrow=true" is not currently supported.'
        );
      }
    },
    arrowPosition: PropTypes.string,
    onClose: PropTypes.func,
    dismissText: PropTypes.string,
    className: PropTypes.string,
    target: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    disableOffscreenPointout: PropTypes.bool,
    portal: PropTypes.any,
    previousButtonProps: PropTypes.any,
    nextButtonProps: PropTypes.any,
    closeButtonProps: PropTypes.any
  };

  private resizeDebounceId: number;
  private resizeDebounce: () => void;
  private offscreenRef: HTMLElement | null;
  private offscreenContentRef: HTMLElement | null;
  private visibleRef: HTMLElement | null;

  constructor(props: PointoutProps) {
    super(props);
    this.state = { show: true, style: {} };
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  getFocusableElements(root: HTMLElement | null) {
    return root
      ? Array.from(root.querySelectorAll(`${focusable}, [data-focusable]`))
      : [];
  }

  componentDidMount() {
    const { positionRelativeToTarget, attachOffscreenListeners } = this;

    positionRelativeToTarget();

    this.setState({ headingId: rndid() });

    // debounce resize event to rAF
    this.resizeDebounce = () => {
      if (this.resizeDebounceId) {
        cancelAnimationFrame(this.resizeDebounceId);
      }
      this.resizeDebounceId = requestAnimationFrame(() => {
        this.positionRelativeToTarget();
      });
    };
    window.addEventListener('resize', this.resizeDebounce);
    attachOffscreenListeners();

    // If the component mounts before fonts have finished loading, ensure that we
    // reposition the element when all fonts are ready
    if (document && (document as any).fonts && (document as any).fonts.ready) {
      // experiemental apis aren't in typescript's lib file :(
      // https://github.com/Microsoft/TypeScript/issues/30984
      (document as any).fonts.ready.then(() => this.positionRelativeToTarget());
    }
  }

  forceUpdate() {
    super.forceUpdate();
    requestAnimationFrame(() => this.positionRelativeToTarget());
  }

  componentWillUnmount() {
    const {
      resizeDebounce,
      offscreenRef,
      offscreenContentRef,
      handleOffscreenFocusIn,
      handleOffscreenFocusOut,
      handleOffscreenContentFocusIn,
      handleOffscreenContentFocusOut
    } = this;

    if (resizeDebounce) {
      window.removeEventListener('resize', resizeDebounce);
    }

    if (offscreenRef) {
      offscreenRef.removeEventListener('focusin', handleOffscreenFocusIn);
      offscreenRef.removeEventListener('focusout', handleOffscreenFocusOut);
    }

    if (offscreenContentRef) {
      offscreenContentRef.removeEventListener(
        'focusin',
        handleOffscreenContentFocusIn
      );
      offscreenContentRef.removeEventListener(
        'focusout',
        handleOffscreenContentFocusOut
      );
    }
  }

  // Mirror the offscreen focus to the visible content
  attachOffscreenListeners = () => {
    const {
      offscreenRef,
      offscreenContentRef,
      handleOffscreenFocusIn,
      handleOffscreenFocusOut,
      handleOffscreenContentFocusIn,
      handleOffscreenContentFocusOut
    } = this;

    if (offscreenRef) {
      offscreenRef.removeEventListener('focusin', handleOffscreenFocusIn);
      offscreenRef.addEventListener('focusin', handleOffscreenFocusIn);
      offscreenRef.removeEventListener('focusout', handleOffscreenFocusOut);
      offscreenRef.addEventListener('focusout', handleOffscreenFocusOut);
    }

    // Manually handle offscreen content since it has a -1 tab index
    if (offscreenContentRef) {
      offscreenContentRef.removeEventListener(
        'focusin',
        handleOffscreenContentFocusIn
      );
      offscreenContentRef.addEventListener(
        'focusin',
        handleOffscreenContentFocusIn
      );
      offscreenContentRef.removeEventListener(
        'focusout',
        handleOffscreenContentFocusOut
      );
      offscreenContentRef.addEventListener(
        'focusout',
        handleOffscreenContentFocusOut
      );
    }
  };

  handleOffscreenContentFocusIn = ({ target }: FocusEvent) => {
    if (target === this.offscreenContentRef) {
      this.setState({ offscreenContentFocus: true });
    }
  };

  handleOffscreenContentFocusOut = ({ target }: FocusEvent) => {
    if (target === this.offscreenContentRef) {
      this.setState({ offscreenContentFocus: false });
    }
  };

  handleOffscreenFocusIn = ({ target }: FocusEvent) => {
    const { offscreenRef, visibleRef, getFocusableElements } = this;
    const offscreenFocusable = getFocusableElements(offscreenRef);
    const visibleFocusable = getFocusableElements(visibleRef);
    const elementIndex = offscreenFocusable.findIndex(
      element => element === target
    );

    if (elementIndex === -1 || !visibleFocusable[elementIndex]) {
      return;
    }

    // Tag focusable elements
    for (const element of visibleFocusable) {
      element.setAttribute('data-focusable', 'true');
      element.setAttribute('tabindex', '-1');
    }

    visibleFocusable[elementIndex].classList.add('Pointout--focus-active');
  };

  handleOffscreenFocusOut = ({ target }: FocusEvent) => {
    const { offscreenRef, visibleRef, getFocusableElements } = this;
    const offscreenFocusable = getFocusableElements(offscreenRef);
    const visibleFocusable = getFocusableElements(visibleRef);
    const elementIndex = offscreenFocusable.findIndex(
      element => element === target
    );

    if (elementIndex === -1 || !visibleFocusable[elementIndex]) {
      return;
    }

    visibleFocusable[elementIndex].classList.remove('Pointout--focus-active');
  };

  positionRelativeToTarget = () => {
    const { target, portal, arrowPosition } = this.props;

    if (!target) {
      return;
    }

    const targetNode =
      (target as React.RefObject<HTMLElement>)?.current ||
      (target as HTMLElement);
    const portalNode =
      (portal as React.RefObject<HTMLElement>)?.current ||
      (portal as HTMLElement);

    let { top, left, width, height } = targetNode.getBoundingClientRect();
    if (portalNode && portalNode !== document.body) {
      // If the portal is not placed on document.body
      // position the FTPO relative to the portal
      const rect = portalNode.getBoundingClientRect();
      top -= rect.top - portalNode.scrollTop;
      left -= rect.left - portalNode.scrollLeft;
    }

    const [arrowBoxSide] = arrowPosition.split('-');

    let style;
    switch (arrowBoxSide) {
      case 'right':
        style = {
          left: `${left}px`,
          top: `${top + height / 2}px`
        };
        break;
      case 'bottom':
        style = {
          top: `${top}px`,
          left: `${left + width / 2}px`
        };
        break;
      case 'left':
        style = {
          left: `${left + width}px`,
          top: `${top + height / 2}px`
        };
        break;
      case 'top':
      default:
        style = {
          top: `${top + height}px`,
          left: `${left + width / 2}px`
        };
        break;
    }

    this.setState({ style });
  };

  componentDidUpdate(nextProps: PointoutProps) {
    const { props, attachOffscreenListeners, positionRelativeToTarget } = this;
    if (
      props.arrowPosition !== nextProps.arrowPosition ||
      props.portal !== nextProps.portal ||
      props.target !== nextProps.target ||
      props.disableOffscreenPointout !== nextProps.disableOffscreenPointout
    ) {
      attachOffscreenListeners();
      positionRelativeToTarget();
    }
  }

  render() {
    const { show, style, offscreenContentFocus, headingId } = this.state;
    const {
      heading,
      ftpoRef,
      children,
      noArrow,
      dismissText,
      previousText,
      nextText,
      showNext,
      showPrevious,
      arrowPosition,
      className,
      target,
      disableOffscreenPointout,
      portal = document.body,
      previousButtonProps,
      nextButtonProps,
      closeButtonProps
    } = this.props;

    if (!show) {
      return null;
    }

    const FTPO = (
      <div
        className={classNames(className, 'Pointout', {
          'Pointout--no-arrow': noArrow,
          'Pointout--auto': !!target,
          [`Pointout__arrow--${arrowPosition}`]: !!arrowPosition && !noArrow
        })}
        style={style}
        role={target ? undefined : 'region'}
        aria-labelledby={heading ? headingId : undefined}
        aria-hidden={!!target && !disableOffscreenPointout}
        ref={el => (this.visibleRef = el)}
      >
        {noArrow ? null : (
          <div
            className={classNames('Pointout__arrow', {
              [`Pointout__arrow--${arrowPosition}`]: !!arrowPosition && !noArrow
            })}
          >
            <div className="Pointout__arrow-pointer" />
          </div>
        )}
        <div className="Pointout__box">
          {showPrevious && (
            <button
              className="Pointout__previous"
              type="button"
              aria-label={previousText}
              tabIndex={!!target && !disableOffscreenPointout ? -1 : 0}
              {...previousButtonProps}
            >
              <Icon type="arrow-left" aria-hidden="true" />
            </button>
          )}
          {showNext && (
            <button
              className="Pointout__next"
              type="button"
              aria-label={nextText}
              tabIndex={!!target && !disableOffscreenPointout ? -1 : 0}
              {...nextButtonProps}
            >
              <Icon type="arrow-right" aria-hidden="true" />
            </button>
          )}
          <button
            className="Pointout__dismiss"
            type="button"
            aria-label={dismissText}
            onClick={this.onCloseClick}
            tabIndex={!!target && !disableOffscreenPointout ? -1 : 0}
            {...closeButtonProps}
          >
            <Icon type="close" aria-hidden="true" />
          </button>
          {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
          <div
            className={classNames('Pointout__content', {
              'Pointout__content--focus-active': offscreenContentFocus
            })}
            tabIndex={!target ? -1 : undefined}
            ref={ftpoRef}
          >
            {heading &&
              React.cloneElement(heading as React.ReactElement<any>, {
                id: target ? null : headingId,
                className: classNames(
                  'Pointout__heading',
                  (heading as React.ReactElement<any>).props?.className
                )
              })}
            {target ? removeIds(children) : children}
          </div>
          {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
        </div>
      </div>
    );

    if (target && portal && !disableOffscreenPointout) {
      return (
        <React.Fragment>
          <div
            className="Offscreen"
            role="region"
            aria-labelledby={heading ? headingId : undefined}
            ref={el => (this.offscreenRef = el)}
          >
            <button
              type="button"
              aria-label={previousText}
              {...previousButtonProps}
            />
            <button type="button" aria-label={nextText} {...nextButtonProps} />
            <button
              type="button"
              aria-label={dismissText}
              onClick={this.onCloseClick}
              {...closeButtonProps}
            />
            <div
              className="Pointout__content"
              tabIndex={-1}
              ref={el => (this.offscreenContentRef = el)}
            >
              {heading &&
                React.cloneElement(heading as React.ReactElement<any>, {
                  id: headingId
                })}
              {children}
            </div>
          </div>
          {createPortal(FTPO, portal as HTMLElement)}
        </React.Fragment>
      );
    }

    return FTPO;
  }

  onCloseClick() {
    this.setState({ show: false });
    this.props?.onClose();
  }
}

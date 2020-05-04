import React, { StyleHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import focusable from 'focusable';
import rndid from '../../utils/rndid';
import removeIds from '../../utils/remove-ids';

export interface FirstTimePointOutProps {
  arrowPosition:
    | 'top-left'
    | 'top-middle'
    | 'top-right'
    | 'right-top'
    | 'right-middle'
    | 'right-bottom'
    | 'bottom-right'
    | 'bottom-middle'
    | 'bottom-left'
    | 'left-bottom'
    | 'left-middle'
    | 'left-top';
  heading?: React.ReactNode;
  className?: string;
  headerId: string;
  children: React.ReactNode;
  ftpoRef: React.Ref<HTMLDivElement>;
  noArrow?: boolean;
  onClose: () => void;
  dismissText?: string;
  target?: React.RefObject<HTMLElement> | HTMLElement;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
}

interface FirstTimePointOutState {
  show: boolean;
  style: React.CSSProperties;
  headingId?: string;
  offscreenContentFocus?: boolean;
}

export default class FirstTimePointOut extends React.Component<
  FirstTimePointOutProps,
  FirstTimePointOutState
> {
  static defaultProps = {
    ftpoRef: () => {},
    noArrow: false,
    onClose: () => {},
    dismissText: 'dismiss',
    arrowPosition: 'top-left'
  };

  static propTypes = {
    heading: PropTypes.node,
    children: PropTypes.node.isRequired,
    ftpRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    noArrow: function(
      props: FirstTimePointOutProps,
      propName: keyof FirstTimePointOutProps
    ) {
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
    portal: PropTypes.any
  };

  private resizeDebounceId: number;
  private resizeDebounce: () => void;
  private offscreenRef: HTMLElement | null;
  private offscreenContentRef: HTMLElement | null;
  private visibleRef: HTMLElement | null;

  constructor(props: FirstTimePointOutProps) {
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
    for (var element of visibleFocusable) {
      element.setAttribute('data-focusable', 'true');
      element.setAttribute('tabindex', '-1');
    }

    visibleFocusable[elementIndex].classList.add('dqpl-focus-active');
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

    visibleFocusable[elementIndex].classList.remove('dqpl-focus-active');
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
      let rect = portalNode.getBoundingClientRect();
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

  componentDidUpdate(nextProps: FirstTimePointOutProps) {
    const { props, attachOffscreenListeners, positionRelativeToTarget } = this;
    if (
      props.arrowPosition !== nextProps.arrowPosition ||
      props.portal !== nextProps.portal ||
      props.target !== nextProps.target
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
      arrowPosition,
      className,
      target,
      portal = document.body
    } = this.props;

    if (!show) {
      return null;
    }

    const FTPO = (
      <div
        className={classNames(className, 'dqpl-pointer-wrap', {
          'dqpl-no-arrow': noArrow,
          'dqpl-ftpo-auto': !!target,
          [arrowPosition]: !!arrowPosition && !noArrow
        })}
        style={style}
        role={target ? undefined : 'region'}
        aria-labelledby={heading ? headingId : undefined}
        aria-hidden={!!target}
        ref={el => (this.visibleRef = el)}
      >
        {noArrow ? null : (
          <div
            className={classNames('dqpl-arrow', {
              [arrowPosition]: !!arrowPosition && !noArrow
            })}
          >
            <div className="dqpl-arrow-pointer" />
            <div className="dqpl-arrow-neck" />
          </div>
        )}
        <div className="dqpl-box">
          <button
            className="dqpl-ftpo-dismiss fa fa-close"
            type="button"
            aria-label={dismissText}
            onClick={this.onCloseClick}
            tabIndex={target ? -1 : 0}
          />
          {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
          <div
            className={classNames('dqpl-content', {
              'dqpl-content-focus-active': offscreenContentFocus
            })}
            tabIndex={!target ? -1 : undefined}
            ref={ftpoRef}
          >
            {heading &&
              React.cloneElement(heading as React.ReactElement<any>, {
                id: target ? null : headingId
              })}
            {target ? removeIds(children) : children}
          </div>
          {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
        </div>
      </div>
    );

    if (target && portal) {
      return (
        <React.Fragment>
          <div
            className="dqpl-offscreen"
            role="region"
            aria-labelledby={heading ? headingId : undefined}
            ref={el => (this.offscreenRef = el)}
          >
            <button
              type="button"
              aria-label={dismissText}
              onClick={this.onCloseClick}
            />
            <div
              className="dqpl-content"
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
    this.props.onClose();
  }
}

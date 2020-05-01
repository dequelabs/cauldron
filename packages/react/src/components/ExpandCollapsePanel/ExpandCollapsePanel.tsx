import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import PanelTrigger from './PanelTrigger';
import {
  injectStyleTag,
  setStyle,
  removeStyleTag
} from '../../utils/stylesheets';

export interface ExpandCollapsePanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  children: React.ReactNode;
  animationTiming?: number | boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface ExpandCollapsePanelState {
  controlled: boolean;
  isOpen: boolean;
  isAnimating?: boolean;
  animationClass?: string;
}

export default class ExpandCollapsePanel extends React.Component<
  ExpandCollapsePanelProps,
  ExpandCollapsePanelState
> {
  static defaultProps = {
    animationTiming: 250,
    onToggle: () => {}
  };

  static propTypes = {
    open: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    animationTiming: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onToggle: PropTypes.func
  };

  readonly state: ExpandCollapsePanelState = {
    controlled: typeof this.props.open !== 'undefined',
    isOpen: typeof this.props.open !== 'undefined' ? this.props.open : false
  };

  private panel = React.createRef<HTMLDivElement>();

  private styleTag: HTMLStyleElement;

  handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { onToggle } = this.props;
    const { isOpen, controlled } = this.state;
    onToggle(e);
    if (!controlled) {
      this.setState({ isOpen: !isOpen, isAnimating: true });
    }
  };

  animateOpen = () => {
    const { current: panel } = this.panel;
    const { animationTiming } = this.props;

    if (!animationTiming) {
      this.setState({ isAnimating: false });
      return;
    }

    const rect = panel?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    if (!this.styleTag) {
      this.styleTag = injectStyleTag();
    }

    setStyle(
      this.styleTag,
      `
      @keyframes expandOpenAnimation {
        0% { opacity: 0; height: 0; }
        100% { opacity: 1; height: ${rect.height}px; }
      }

      .cauldron-expand-open {
        will-change: opacity, height;
        overflow: hidden;
        animation: expandOpenAnimation ease-in-out ${animationTiming}ms forwards;
      }
    `
    );

    this.setState({ animationClass: 'cauldron-expand-open' }, () => {
      setTimeout(() => {
        this.setState({ animationClass: '', isAnimating: false });
        setStyle(this.styleTag, '');
      }, animationTiming as number);
    });
  };

  animateClose = () => {
    const { current: panel } = this.panel;
    const { animationTiming } = this.props;

    if (!animationTiming) {
      this.setState({ isAnimating: false });
      return;
    }

    if (!this.styleTag) {
      this.styleTag = injectStyleTag();
    }

    const rect = panel?.getBoundingClientRect();
    if (!rect) return;

    setStyle(
      this.styleTag,
      `
      @keyframes collapseCloseAnimation {
        0% { opacity: 1; height: ${rect.height}px; }
        100% { opacity: 0; height: 0; }
      }

      .cauldron-collapse-close {
        will-change: opacity, height;
        overflow: hidden;
        animation: collapseCloseAnimation ease-in-out ${animationTiming}ms forwards;
      }
    `
    );

    this.setState({ animationClass: 'cauldron-collapse-close' }, () => {
      setTimeout(() => {
        this.setState({ animationClass: '', isAnimating: false });
        setStyle(this.styleTag, '');
      }, animationTiming as number);
    });
  };

  componentWillUnmount() {
    const { styleTag } = this;
    if (styleTag) {
      removeStyleTag(styleTag);
    }
  }

  componentDidUpdate(
    prevProps: ExpandCollapsePanelProps,
    prevState: ExpandCollapsePanelState
  ) {
    const { isOpen: openState, controlled } = this.state;
    const { open: openProp } = this.props;

    if (controlled && openState !== openProp) {
      this.setState({ isOpen: !!openProp, isAnimating: true });
    }

    if (typeof openProp !== typeof prevProps.open) {
      this.setState({ controlled: typeof openProp !== 'undefined' });
    }

    if (prevState.isOpen !== openState && openState) {
      this.animateOpen();
    } else if (prevState.isOpen !== openState && !openState) {
      this.animateClose();
    }
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      children,
      animationTiming,
      className,
      onToggle,
      open,
      ...other
    } = this.props;
    /* eslint-enable no-unused-vars */
    const { isOpen, isAnimating, animationClass } = this.state;
    const trigger = React.Children.toArray(children).find(
      child => (child as ReactElement<any>).type === PanelTrigger
    );
    const panelElements = React.Children.toArray(children).filter(
      child =>
        typeof child === 'string' ||
        (child as ReactElement<any>).type !== PanelTrigger
    );

    return (
      <React.Fragment>
        {trigger &&
          React.cloneElement(trigger as ReactElement<any>, {
            open: isOpen,
            onClick: this.handleToggle
          })}
        <div
          {...other}
          className={classnames(animationClass, className, {
            'dqpl-hidden': !isOpen && !isAnimating
          })}
          ref={this.panel}
        >
          {panelElements}
        </div>
      </React.Fragment>
    );
  }
}

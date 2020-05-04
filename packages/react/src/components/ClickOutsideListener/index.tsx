import React from 'react';
import PropTypes from 'prop-types';
import setRef from '../../utils/setRef';

export interface ClickOutsideListenerProps {
  children: React.ReactNode;
  onClickOutside: (e: MouseEvent | TouchEvent) => void;
  mouseEvent?: 'mousedown' | 'click' | 'mouseup' | false;
  touchEvent?: 'touchstart' | 'touchend' | false;
}

export default class ClickOutsideListener extends React.Component<
  ClickOutsideListenerProps
> {
  static defaultProps = {
    mouseEvent: 'click',
    touchEvent: 'touchend'
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    onClickOutside: PropTypes.func.isRequired,
    mouseEvent: PropTypes.oneOf(['mousedown', 'click', 'mouseup', false]),
    touchEvent: PropTypes.oneOf(['touchstart', 'touchend', false])
  };

  private nodeRef: HTMLElement | null;

  handleEvent = (event: MouseEvent | TouchEvent) => {
    const { nodeRef, props } = this;
    const { onClickOutside } = props;

    if (event.defaultPrevented) {
      return;
    }

    const target = event.target as HTMLElement;
    if (nodeRef && !nodeRef.contains(target)) {
      onClickOutside(event);
    }
  };

  componentDidMount() {
    this.attachEventListeners();
  }

  componentDidUpdate(prevProps: ClickOutsideListenerProps) {
    const { mouseEvent, touchEvent } = this.props;
    if (
      prevProps.mouseEvent !== mouseEvent ||
      prevProps.touchEvent !== touchEvent
    ) {
      this.removeEventListeners(prevProps.mouseEvent, prevProps.touchEvent);
      this.attachEventListeners();
    }
  }

  componentWillUnmount() {
    const { mouseEvent, touchEvent } = this.props;
    this.removeEventListeners(mouseEvent, touchEvent);
  }

  private attachEventListeners = () => {
    const { mouseEvent, touchEvent } = this.props;
    typeof mouseEvent === 'string' &&
      document.addEventListener(mouseEvent, this.handleEvent);
    typeof touchEvent === 'string' &&
      document.addEventListener(touchEvent, this.handleEvent);
  };

  private removeEventListeners = (
    mouseEvent: ClickOutsideListenerProps['mouseEvent'],
    touchEvent: ClickOutsideListenerProps['touchEvent']
  ) => {
    typeof mouseEvent === 'string' &&
      document.removeEventListener(mouseEvent, this.handleEvent);
    typeof touchEvent === 'string' &&
      document.removeEventListener(touchEvent, this.handleEvent);
  };

  resolveRef = (node: HTMLElement) => {
    this.nodeRef = node;

    setRef;
    // If child has its own ref, we want to update
    // its ref with the newly cloned node
    let { ref } = this.props.children as any;
    setRef(ref, node);
  };

  render() {
    const { props, resolveRef } = this;
    return React.cloneElement(props.children as any, {
      ref: resolveRef
    });
  }
}

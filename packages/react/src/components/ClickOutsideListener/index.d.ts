import React from 'react';
import PropTypes from 'prop-types';
export interface ClickOutsideListenerProps {
  children: React.ReactNode;
  onClickOutside: (e: MouseEvent | TouchEvent) => void;
  mouseEvent?: 'mousedown' | 'click' | 'mouseup' | false;
  touchEvent?: 'touchstart' | 'touchend' | false;
}
export default class ClickOutsideListener extends React.Component<
  ClickOutsideListenerProps
> {
  static defaultProps: {
    mouseEvent: string;
    touchEvent: string;
  };
  static propTypes: {
    children: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    onClickOutside: PropTypes.Validator<(...args: any[]) => any>;
    mouseEvent: PropTypes.Requireable<string | boolean>;
    touchEvent: PropTypes.Requireable<string | boolean>;
  };
  private nodeRef;
  handleEvent: (event: MouseEvent | TouchEvent) => void;
  componentDidMount(): void;
  componentDidUpdate(prevProps: ClickOutsideListenerProps): void;
  componentWillUnmount(): void;
  private attachEventListeners;
  private removeEventListeners;
  resolveRef: (node: HTMLElement) => void;
  render(): React.FunctionComponentElement<{
    ref: (node: HTMLElement) => void;
  }>;
}

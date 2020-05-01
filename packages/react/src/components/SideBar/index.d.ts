import React, { Component } from 'react';
import PropTypes from 'prop-types';
export interface SideBarProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
  onDismiss: () => void;
  className?: string;
  show: boolean;
}
interface SideBarState {
  focusIndex: number;
  wide: boolean;
  animateClass?: string;
}
export default class SideBar extends Component<SideBarProps, SideBarState> {
  static defaultProps: {
    className: string;
    show: boolean;
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
    onDismiss: PropTypes.Validator<(...args: any[]) => any>;
    className: PropTypes.Requireable<string>;
    show: PropTypes.Requireable<boolean>;
  };
  private menuItems;
  constructor(props: SideBarProps);
  componentDidMount(): void;
  componentWillUnmount(): void;
  private onResize;
  private onKeyDown;
  private handleClickOutside;
  componentDidUpdate(prevProps: SideBarProps): void;
  private animate;
  render(): JSX.Element;
}
export {};

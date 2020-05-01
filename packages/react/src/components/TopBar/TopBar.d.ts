import React from 'react';
import PropTypes from 'prop-types';
export interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  hasTrigger?: boolean;
}
interface TopBarState {
  wide: boolean;
  focusIndex: number;
}
export default class TopBar extends React.Component<TopBarProps, TopBarState> {
  static defaultProps: {
    className: string;
    hasTrigger: boolean;
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
    className: PropTypes.Requireable<string>;
    hasTrigger: PropTypes.Requireable<boolean>;
  };
  private menuItems;
  constructor(props: TopBarProps);
  componentDidMount(): void;
  componentWillUnmount(): void;
  private onResize;
  onKeyDown(e: React.KeyboardEvent<HTMLElement>): void;
  render(): JSX.Element;
  private renderChild;
}
export {};

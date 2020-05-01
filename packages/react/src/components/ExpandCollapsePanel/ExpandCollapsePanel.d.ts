import React from 'react';
import PropTypes from 'prop-types';
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
  static defaultProps: {
    animationTiming: number;
    onToggle: () => void;
  };
  static propTypes: {
    open: PropTypes.Requireable<boolean>;
    children: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    className: PropTypes.Requireable<string>;
    animationTiming: PropTypes.Requireable<number | boolean>;
    onToggle: PropTypes.Requireable<(...args: any[]) => any>;
  };
  readonly state: ExpandCollapsePanelState;
  private panel;
  private styleTag;
  handleToggle: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  animateOpen: () => void;
  animateClose: () => void;
  componentWillUnmount(): void;
  componentDidUpdate(
    prevProps: ExpandCollapsePanelProps,
    prevState: ExpandCollapsePanelState
  ): void;
  render(): JSX.Element;
}
export {};

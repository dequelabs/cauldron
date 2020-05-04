import React, { Component } from 'react';
import PropTypes from 'prop-types';
export interface OptionsMenuAlignmentProps {
  align?: 'left' | 'right';
}
export interface OptionsMenuRenderTriggerProps {
  onClick: (event: Event) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  'aria-expanded': boolean;
  ref: React.RefObject<HTMLElement>;
}
export interface OptionsMenuProps extends OptionsMenuAlignmentProps {
  id?: string;
  menuRef?: React.Ref<HTMLUListElement>;
  trigger: (props: OptionsMenuRenderTriggerProps) => React.ReactNode;
  onClose: () => void;
  onSelect: (e: React.MouseEvent<HTMLElement>) => void;
  closeOnSelect?: boolean;
  show?: boolean;
}
interface OptionsMenuState {
  show: boolean;
}
declare type AllOptionsMenuProps = OptionsMenuProps &
  React.HTMLAttributes<HTMLLIElement>;
export default class OptionsMenu extends Component<
  AllOptionsMenuProps,
  OptionsMenuState
> {
  static defaultProps: {
    onClose: () => void;
    onSelect: () => void;
    align: string;
  };
  static propTypes: {
    trigger: PropTypes.Validator<(...args: any[]) => any>;
    children: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    onClose: PropTypes.Requireable<(...args: any[]) => any>;
    className: PropTypes.Requireable<string>;
    onSelect: PropTypes.Requireable<(...args: any[]) => any>;
    closeOnSelect: PropTypes.Requireable<boolean>;
    menuRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    align: PropTypes.Requireable<string>;
  };
  private triggerRef;
  constructor(props: AllOptionsMenuProps);
  toggleMenu: (event: Event) => void;
  handleClose: () => void;
  handleTriggerKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  render(): JSX.Element;
}
export {};

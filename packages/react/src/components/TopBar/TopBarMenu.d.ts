import React from 'react';
import PropTypes from 'prop-types';
export interface TopBarMenuProps
  extends Pick<
    React.HTMLAttributes<HTMLLIElement>,
    Exclude<keyof React.HTMLAttributes<HTMLLIElement>, 'onKeyDown'>
  > {
  onKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  menuItemRef: React.Ref<HTMLLIElement>;
}
interface TopBarMenuState {
  open: boolean;
}
export default class TopBarMenu extends React.Component<
  TopBarMenuProps,
  TopBarMenuState
> {
  static defaultProps: {
    onKeyDown: () => void;
    menuItemRef: () => void;
  };
  static propTypes: {
    id: PropTypes.Validator<string>;
    children: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
  };
  state: TopBarMenuState;
  private optionsMenuRef;
  private menuItemRef;
  private handleClick;
  private handleClose;
  private handleKeyDown;
  render(): JSX.Element;
}
export {};

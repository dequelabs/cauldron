import React, { Component } from 'react';
import PropTypes from 'prop-types';
interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  menuItemRef: React.Ref<HTMLLIElement>;
  onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  autoClickLink?: boolean;
}
export default class MenuItem extends Component<MenuItemProps> {
  static defaultProps: {
    menuItemRef: () => void;
    onClick: () => void;
    onKeyDown: () => void;
    autoClickLink: boolean;
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
    menuItemRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    onClick: PropTypes.Requireable<(...args: any[]) => any>;
    onKeyDown: PropTypes.Requireable<(...args: any[]) => any>;
    autoClickLink: PropTypes.Requireable<boolean>;
  };
  private item;
  constructor(props: MenuItemProps);
  onClick(e: React.MouseEvent<HTMLLIElement>): void;
  onKeyDown(e: React.KeyboardEvent<HTMLLIElement>): void;
  render(): JSX.Element;
}
export {};

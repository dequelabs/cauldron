import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keyname from 'keyname';
import clickLink from './click-link';
import setRef from '../../utils/setRef';

interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  menuItemRef: React.Ref<HTMLLIElement>;
  onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  autoClickLink?: boolean;
}

export default class MenuItem extends Component<MenuItemProps> {
  static defaultProps = {
    menuItemRef: () => {},
    onClick: () => {},
    onKeyDown: () => {},
    autoClickLink: true
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    menuItemRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    autoClickLink: PropTypes.bool
  };

  private item: HTMLLIElement | null;

  constructor(props: MenuItemProps) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onClick(e: React.MouseEvent<HTMLLIElement>) {
    const { autoClickLink, onClick } = this.props;
    if (autoClickLink) {
      clickLink(e.target as HTMLElement, this.item as HTMLElement);
    }
    onClick(e);
  }

  onKeyDown(e: React.KeyboardEvent<HTMLLIElement>) {
    const key = keyname(e.which);

    if (key === 'enter' || key === 'space') {
      e.preventDefault();
      this.item?.click();
    }

    this.props.onKeyDown(e);
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { children, menuItemRef, autoClickLink, ...other } = this.props;
    return (
      <li
        {...other}
        role="menuitem"
        ref={item => {
          this.item = item;
          setRef(menuItemRef, item);
        }}
        onClick={this.onClick}
        onKeyDown={this.onKeyDown}
      >
        {children}
      </li>
    );
  }
}

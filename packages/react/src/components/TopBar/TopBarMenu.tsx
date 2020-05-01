import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '../MenuItem';
import { OptionsMenuList } from '../OptionsMenu';
import classnames from 'classnames';
import keyname from 'keyname';
import setRef from '../../utils/setRef';

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
  static defaultProps = {
    onKeyDown: () => {},
    menuItemRef: () => {}
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  state: TopBarMenuState = {
    open: false
  };

  private optionsMenuRef: HTMLUListElement | null;
  private menuItemRef: HTMLLIElement | null;

  private handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const { optionsMenuRef, state } = this;
    const { open } = state;

    if (optionsMenuRef && !optionsMenuRef.contains(e.target as HTMLLIElement)) {
      this.setState({ open: !open });
      e.preventDefault();
    }
  };

  private handleClose = () => {
    this.setState({ open: false });
    this.menuItemRef?.focus();
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    const key = keyname(e.which);
    const { handleClose, state, props } = this;
    const { open } = state;
    const { onKeyDown } = props;

    if ((key === 'left' || key === 'right') && open) {
      handleClose();
    } else if (key === 'down' && !open) {
      this.setState({ open: true });
      this.optionsMenuRef?.focus();
    }

    onKeyDown(e);
  };

  render() {
    const { props, state, handleClick, handleClose, handleKeyDown } = this;
    const { children, id, ...other } = props;
    const { open } = state;

    const menu = React.Children.toArray(children).find(
      child => (child as React.ReactElement<any>).type === OptionsMenuList
    );
    const otherChildren = React.Children.toArray(children).filter(
      child =>
        typeof child === 'string' ||
        (child as React.ReactElement<any>).type !== OptionsMenuList
    );

    return (
      <MenuItem
        {...other}
        menuItemRef={el => {
          this.menuItemRef = el;
          setRef(props.menuItemRef, el);
        }}
        aria-controls={id}
        aria-expanded={open}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {otherChildren}
        {React.cloneElement(menu as React.ReactElement<any>, {
          id,
          className: classnames('dqpl-dropdown', {
            'dqpl-dropdown-active': open
          }),
          menuRef: (el: HTMLUListElement | null) => (this.optionsMenuRef = el),
          show: open,
          onClose: handleClose
        })}
      </MenuItem>
    );
  }
}

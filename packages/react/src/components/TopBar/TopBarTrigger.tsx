import React from 'react';
import PropTypes from 'prop-types';
import keyname from 'keyname';
import MenuItem from '../MenuItem';
import Icon from '../Icon';

const noop = () => {};

interface TopBarTriggerProps {
  onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  menuItemRef?: React.Ref<HTMLLIElement>;
}

export default class TopBarTrigger extends React.Component<TopBarTriggerProps> {
  static defaultProps = {
    onClick: noop,
    onKeyDown: noop
  };

  static propTypes = {
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func
  };

  constructor(props: TopBarTriggerProps) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  private onKeyDown(e: React.KeyboardEvent<HTMLLIElement>) {
    const key = keyname(e.which);

    if (!['enter', 'space'].includes(key)) {
      return;
    }

    e.preventDefault();
    this.props.onClick((e as unknown) as React.MouseEvent<HTMLLIElement>);
    this.props.onKeyDown(e);
  }

  render() {
    return (
      <MenuItem
        className="dqpl-menu-trigger"
        aria-label="Menu"
        aria-haspopup="true"
        onKeyDown={this.onKeyDown}
        {...this.props}
      >
        <Icon type="fa-bars" />
      </MenuItem>
    );
  }
}

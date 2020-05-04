import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import keyname from 'keyname';
import { isWide } from '../../utils/viewport';

export interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  hasTrigger?: boolean;
}

interface TopBarState {
  wide: boolean;
  focusIndex: number;
}

export default class TopBar extends React.Component<TopBarProps, TopBarState> {
  static defaultProps = {
    className: '',
    hasTrigger: false
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hasTrigger: PropTypes.bool
  };

  private menuItems: HTMLLIElement[] = [];

  constructor(props: TopBarProps) {
    super(props);
    const wide = isWide();
    this.state = {
      wide,
      focusIndex: this.props.hasTrigger && wide ? 1 : 0
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize() {
    const { hasTrigger } = this.props;
    const { focusIndex } = this.state;
    const wide = isWide();

    if (wide === this.state.wide) {
      return;
    }

    this.setState({
      wide,
      focusIndex: wide && focusIndex === 0 && hasTrigger ? 1 : focusIndex
    });
  }

  onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    const { hasTrigger } = this.props;
    const { focusIndex, wide } = this.state;
    const key = keyname(e.which);
    const beginning = wide && hasTrigger ? 1 : 0;

    switch (key) {
      case 'left': {
        const newFocusIndex =
          focusIndex === beginning ? this.menuItems.length - 1 : focusIndex - 1;
        e.preventDefault();
        this.setState({ focusIndex: newFocusIndex });
        this.menuItems[newFocusIndex].focus();

        break;
      }

      case 'right': {
        const newFocusIndex =
          focusIndex === this.menuItems.length - 1 ? beginning : focusIndex + 1;
        e.preventDefault();

        this.setState({ focusIndex: newFocusIndex });
        this.menuItems[newFocusIndex].focus();

        break;
      }
    }
  }

  render() {
    this.menuItems = [];
    // disabling no-unused-vars to prevent hasTrigger from being passed through to div
    // eslint-disable-next-line no-unused-vars
    const { children, className, hasTrigger, ...other } = this.props;

    return (
      <div className={classNames('dqpl-top-bar', className)} {...other}>
        <ul role="menubar">
          {Children.map(
            children as React.ReactElement<HTMLLIElement>,
            this.renderChild
          )}
        </ul>
      </div>
    );
  }

  private renderChild = (child: React.ReactElement<any>, index: number) => {
    const { focusIndex } = this.state;

    if (!child) {
      return null;
    }

    return cloneElement(child, {
      key: index,
      onKeyDown: (...args: any) => {
        // @ts-ignore we're just spreading the original args
        this.onKeyDown(...args);

        if (child.props.onKeyDown) {
          child.props.onKeyDown(...args);
        }
      },
      tabIndex: focusIndex === index ? 0 : -1,
      menuItemRef: (menuItem: HTMLLIElement) => {
        if (menuItem) {
          this.menuItems.push(menuItem);
        }

        if (child.props.menuItemRef) {
          child.props.menuItemRef(menuItem);
        }
      }
    });
  };
}

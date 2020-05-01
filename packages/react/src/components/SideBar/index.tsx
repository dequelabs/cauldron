import React, { Component, Children, cloneElement, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import keyname from 'keyname';
import Scrim from '../Scrim';
import ClickOutsideListener from '../ClickOutsideListener';
import { isWide } from '../../utils/viewport';

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
  static defaultProps = {
    className: '',
    show: false
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    onDismiss: PropTypes.func.isRequired,
    className: PropTypes.string,
    show: PropTypes.bool
  };

  private menuItems: HTMLElement[] = [];

  constructor(props: SideBarProps) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onResize = this.onResize.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      focusIndex: 0,
      wide: isWide()
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize() {
    const wide = isWide();

    if (wide === this.state.wide) {
      return;
    }

    this.setState({ wide });
  }

  private onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    const { children, onDismiss } = this.props;
    const { focusIndex } = this.state;
    const key = keyname(e.which);

    switch (key) {
      case 'up': {
        const newFocusIndex =
          focusIndex === 0 ? Children.count(children) - 1 : focusIndex - 1;
        e.preventDefault();
        this.setState({ focusIndex: newFocusIndex });
        this.menuItems[newFocusIndex].focus();

        break;
      }

      case 'down': {
        const newFocusIndex =
          focusIndex === Children.count(children) - 1 ? 0 : focusIndex + 1;
        e.preventDefault();
        this.setState({ focusIndex: newFocusIndex });
        this.menuItems[newFocusIndex].focus();

        break;
      }

      case 'esc':
        onDismiss();

        break;
    }
  }

  private handleClickOutside() {
    let { show, onDismiss } = this.props;
    if (show && !this.state.wide) {
      onDismiss();
    }
  }

  componentDidUpdate(prevProps: SideBarProps) {
    const { show } = this.props;

    if (prevProps.show === show) {
      return;
    }

    this.animate();
  }

  private animate() {
    const { show } = this.props;
    const [first, second] = show
      ? ['dqpl-show', 'dqpl-show dqpl-active']
      : ['dqpl-show', ''];

    this.setState({ animateClass: first });
    // css3 animations require transition classes to be added on separate tics
    setTimeout(() => {
      this.setState({ animateClass: second });

      if (show) {
        this.menuItems[this.state.focusIndex].focus();
      }
    }, 100); // slide out animation requires a min timeout of 100ms
  }

  render() {
    this.menuItems = [];
    const { focusIndex, animateClass, wide } = this.state;
    // disabling no-unused-vars to prevent onDismiss from being passed through to dom element
    // eslint-disable-next-line no-unused-vars
    const { children, className, show, onDismiss, ...other } = this.props;
    const listProps = { ...other };

    if (!wide) {
      listProps['aria-expanded'] = show;
    }

    return (
      <Fragment>
        <ClickOutsideListener onClickOutside={this.handleClickOutside}>
          <ul
            role="menu"
            className={classNames('dqpl-side-bar', className, animateClass)}
            {...listProps}
          >
            {Children.map(children, (child, index) =>
              cloneElement(child as React.ReactElement<any>, {
                key: index,
                onKeyDown: this.onKeyDown,
                tabIndex: focusIndex === index ? 0 : -1,
                menuItemRef: (menuItem: HTMLElement) =>
                  (this.menuItems[index] = menuItem)
              })
            )}
          </ul>
        </ClickOutsideListener>
        <Scrim show={!wide && show} />
      </Fragment>
    );
  }
}

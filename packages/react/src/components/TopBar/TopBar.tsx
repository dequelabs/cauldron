import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import keyname from 'keyname';
import { isWide } from '../../utils/viewport';

export interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  thin?: boolean;
  hasTrigger?: boolean;
}

interface TopBarState {
  wide: boolean;
}

export default class TopBar extends React.Component<TopBarProps, TopBarState> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    thin: PropTypes.bool,
    hasTrigger: PropTypes.bool
  };

  static defaultProps = {
    thin: false,
    hasTrigger: false
  };

  private menuItems: HTMLLIElement[] = [];

  constructor(props: TopBarProps) {
    super(props);
    const wide = isWide();
    this.state = {
      wide
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    this.handleThin();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidUpdate(prevProps: TopBarProps) {
    if (prevProps.thin === this.props.thin) {
      return;
    }

    this.handleThin();
  }

  private onResize = () => {
    const wide = isWide();

    if (wide === this.state.wide) {
      return;
    }

    this.setState({
      wide
    });
  };

  private handleThin = () => {
    const { thin } = this.props;
    if (thin) {
      document.body.classList.add('dqpl-top-bar-thin');
      return;
    }

    document.body.classList.remove('dqpl-top-bar-thin');
  };

  private renderChild = (child: React.ReactElement<any>, index: number) => {
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
      tabIndex: 0,
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

  onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    const key = keyname(e.which);
    const menuItems = [...this.menuItems];

    // account for hidden side bar trigger (hamburger)
    if (this.state.wide && this.props.hasTrigger) {
      menuItems.shift();
    }

    const currentIndex = menuItems.findIndex(menuitem => menuitem === e.target);
    if (currentIndex === -1 || (key !== 'left' && key !== 'right')) {
      return;
    }

    e.preventDefault();

    let adjacentIndex = key === 'left' ? currentIndex - 1 : currentIndex + 1;
    // circular arrow focus
    if (adjacentIndex === -1) {
      // first to last
      adjacentIndex = menuItems.length - 1;
    } else if (adjacentIndex === menuItems.length) {
      // last to first
      adjacentIndex = 0;
    }

    menuItems[adjacentIndex].focus();
  }

  render() {
    this.menuItems = [];
    // disabling no-unused-vars to prevent thin/hasTrigger from being passed through to div
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, className, thin, hasTrigger, ...other } = this.props;

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
}

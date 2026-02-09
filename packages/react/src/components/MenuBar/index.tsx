import React, { Children, cloneElement, createRef } from 'react';
import keyname from 'keyname';
import { isWide } from '../../utils/viewport';

export interface MenuBarProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
  thin?: boolean;
  hasTrigger?: boolean;
}

interface MenuBarState {
  wide: boolean;
}

export default class TopBar extends React.Component<
  MenuBarProps,
  MenuBarState
> {
  static defaultProps = {
    thin: false,
    hasTrigger: false
  };

  private menuBarRef = createRef<HTMLUListElement>();

  constructor(props: MenuBarProps) {
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

  componentDidUpdate(prevProps: MenuBarProps) {
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
      document.body.classList.add('TopBar--thin');
      return;
    }

    document.body.classList.remove('TopBar--thin');
  };

  private renderChild = (child: React.ReactElement<any>, index: number) => {
    if (!child) {
      return null;
    }

    return cloneElement(child, {
      key: index,
      tabIndex:
        typeof child.props.tabIndex === 'undefined' ? 0 : child.props.tabIndex
    });
  };

  onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    const key = keyname(e.which);
    const menuBarElement = this.menuBarRef.current;
    if (!menuBarElement) return;
    const menuItems = Array.from(menuBarElement.children) as HTMLElement[];

    // account for hidden side bar trigger (hamburger)
    if (this.state.wide && this.props.hasTrigger) {
      menuItems.shift();
    }

    const currentIndex = menuItems.findIndex(
      (menuitem) => menuitem === e.target
    );

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
    // disabling no-unused-vars to prevent thin/hasTrigger from being passed through to div
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, className, thin, hasTrigger, ...other } = this.props;

    return (
      <ul
        ref={this.menuBarRef}
        role="menubar"
        onKeyDown={this.onKeyDown}
        className={className}
      >
        {Children.map(
          children as React.ReactElement<HTMLLIElement>,
          this.renderChild
        )}
      </ul>
    );
  }
}

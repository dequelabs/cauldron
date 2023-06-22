import React from 'react';
import PropTypes from 'prop-types';
import { OptionsMenuProps } from './OptionsMenu';
import ClickOutsideListener from '../ClickOutsideListener';
import classnames from 'classnames';
import setRef from '../../utils/setRef';

const [up, down, tab, enter, space, esc] = [38, 40, 9, 13, 32, 27];

export interface OptionsMenuListProps
  extends Omit<OptionsMenuProps, 'trigger'> {
  className?: string;
}

interface OptionsMenuListState {
  itemIndex: number;
}

export default class OptionsMenuList extends React.Component<
  OptionsMenuListProps,
  OptionsMenuListState
> {
  static defaultProps = {
    closeOnSelect: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSelect: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose: () => {}
  };

  static propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    className: PropTypes.string,
    onSelect: PropTypes.func,
    closeOnSelect: PropTypes.bool,
    menuRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ])
  };

  private itemRefs: Array<HTMLLIElement | null>;
  private menuRef: HTMLUListElement | null;

  constructor(props: OptionsMenuProps) {
    super(props);
    this.itemRefs = [];
    this.state = { itemIndex: 0 };
  }

  componentDidUpdate(
    prevProps: OptionsMenuProps,
    prevState: OptionsMenuListState
  ) {
    const { itemIndex } = this.state;
    const { show } = this.props;

    if (!prevProps.show && show && this.itemRefs.length) {
      // handles opens
      this.itemRefs[0]?.focus();
      this.setState({ itemIndex: 0 });
    } else if (prevState.itemIndex !== itemIndex) {
      // handle up/down arrows
      this.itemRefs[itemIndex]?.focus();
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const { onClose = OptionsMenuList.defaultProps.onClose } = this.props;
    const { which, target } = e;
    switch (which) {
      case up:
      case down: {
        const { itemIndex } = this.state;
        const itemCount = this.itemRefs.length;
        let newIndex = which === 38 ? itemIndex - 1 : itemIndex + 1;

        // circularity
        if (newIndex === -1) {
          newIndex = itemCount - 1;
        } else if (newIndex === itemCount) {
          newIndex = 0;
        }

        e.preventDefault();
        this.setState({
          itemIndex: newIndex
        });

        break;
      }
      case esc:
        onClose();

        break;
      case enter:
      case space:
        e.preventDefault();
        (target as HTMLElement).click();

        break;
      case tab:
        e.preventDefault();
        onClose();
    }
  };

  private handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const { menuRef, props } = this;
    const { onSelect, onClose = OptionsMenuList.defaultProps.onClose } = props;
    if (menuRef && menuRef.contains(e.target as HTMLElement)) {
      if (!e.defaultPrevented && props.closeOnSelect) {
        onClose();
      }

      onSelect(e);
    }

    const link = (e.target as HTMLElement).querySelector('a');
    if (link) {
      link.click();
    }
  };

  private handleClickOutside = () => {
    const { onClose = OptionsMenuList.defaultProps.onClose, show } = this.props;
    if (show) {
      onClose();
    }
  };

  componentDidMount() {
    // see https://github.com/dequelabs/cauldron-react/issues/150
    this.menuRef?.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    this.menuRef?.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { props, handleClick } = this;
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      children,
      menuRef,
      show,
      className,
      onClose,
      onSelect,
      closeOnSelect,
      ...other
    } = props;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const items = React.Children.toArray(children).map((child, i) => {
      const { className, ...other } = (child as React.ReactElement<any>).props;
      return React.cloneElement(child as React.ReactElement<any>, {
        key: `list-item-${i}`,
        className: classnames('OptionsMenu__list-item', className),
        tabIndex: -1,
        role: 'menuitem',
        ref: (el: HTMLLIElement) => (this.itemRefs[i] = el),
        ...other
      });
    });

    // This allows the ClickOutsideListener to only be activated when the menu is
    // currently open. This prevents an obscure behavior where the activation of a
    // different menu would cause all menus to close
    const clickOutsideEventActive = !show ? false : undefined;

    // Key event is being handled in componentDidMount
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    /* eslint-disable jsx-a11y/role-supports-aria-props */
    return (
      <ClickOutsideListener
        onClickOutside={this.handleClickOutside}
        mouseEvent={clickOutsideEventActive}
        touchEvent={clickOutsideEventActive}
      >
        <ul
          {...other}
          className={classnames('OptionsMenu__list', className)}
          /* aria-expanded is not correct usage here, but the pattern library
          currently styles the open state of the menu. based on this attribute */
          aria-expanded={show}
          role="menu"
          onClick={handleClick}
          ref={el => {
            this.menuRef = el;
            if (menuRef) {
              setRef(menuRef, el);
            }
          }}
        >
          {items}
        </ul>
      </ClickOutsideListener>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events */
  }
}

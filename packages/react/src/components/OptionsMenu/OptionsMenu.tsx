import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OptionsMenuWrapper from './OptionsMenuWrapper';
import OptionsMenuList from './OptionsMenuList';
import setRef from '../../utils/setRef';

const [down] = [40];

export interface OptionsMenuAlignmentProps {
  align?: 'left' | 'right';
}

export interface OptionsMenuRenderTriggerProps {
  onClick: (event: Event) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  'aria-expanded': boolean;
  ref: React.RefObject<HTMLElement>;
}

export interface OptionsMenuProps extends OptionsMenuAlignmentProps {
  id?: string;
  menuRef?: React.Ref<HTMLUListElement>;
  trigger: (props: OptionsMenuRenderTriggerProps) => React.ReactNode;
  onClose: () => void;
  onSelect: (e: React.MouseEvent<HTMLElement>) => void;
  closeOnSelect?: boolean;
  show?: boolean;
}

interface OptionsMenuState {
  show: boolean;
}

type AllOptionsMenuProps = OptionsMenuProps &
  React.HTMLAttributes<HTMLLIElement>;

export default class OptionsMenu extends Component<
  AllOptionsMenuProps,
  OptionsMenuState
> {
  static defaultProps = {
    onClose: () => {},
    onSelect: () => {},
    align: 'right'
  };

  static propTypes = {
    trigger: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    className: PropTypes.string,
    onSelect: PropTypes.func,
    closeOnSelect: PropTypes.bool,
    menuRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    align: PropTypes.oneOf(['left', 'right'])
  };

  private triggerRef: React.RefObject<HTMLElement>;

  constructor(props: AllOptionsMenuProps) {
    super(props);
    this.state = { show: false };
    this.triggerRef = React.createRef();
  }

  toggleMenu = (event: Event) => {
    this.setState(({ show }) => ({ show: !show }));
    event.preventDefault();
  };

  handleClose = () => {
    this.setState({ show: false });
    this.props.onClose();
    this.triggerRef.current?.focus();
  };

  handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const { which, target } = event;
    if (which === down) {
      event.preventDefault();
      (target as HTMLElement).click();
    }
  };

  render() {
    const { toggleMenu, triggerRef, handleTriggerKeyDown } = this;
    /* eslint-disable no-unused-vars */
    const {
      children,
      className,
      closeOnSelect,
      menuRef,
      trigger,
      align,
      onClose,
      ...other
    } = this.props;

    /* eslint-enable no-unused-vars */
    const { show } = this.state;

    return (
      <OptionsMenuWrapper align={align} className={className}>
        {trigger({
          onClick: toggleMenu,
          'aria-expanded': show,
          ref: triggerRef,
          onKeyDown: handleTriggerKeyDown
        })}
        <OptionsMenuList
          show={show}
          menuRef={el => {
            if (menuRef) {
              setRef(menuRef, el);
            }
          }}
          onClose={this.handleClose}
          {...other}
        >
          {children}
        </OptionsMenuList>
      </OptionsMenuWrapper>
    );
  }
}

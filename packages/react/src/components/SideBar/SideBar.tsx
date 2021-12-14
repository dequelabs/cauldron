import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import keyname from 'keyname';
import Scrim from '../Scrim';
import ClickOutsideListener from '../ClickOutsideListener';
import { isWide } from '../../utils/viewport';
import focusableSelector from '../../utils/focusable-selector';

export interface SideBarProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
  onDismiss: () => void;
  className?: string;
  show: boolean;
  navProps: React.HTMLAttributes<HTMLElement>;
}

interface SideBarState {
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

  private navList = React.createRef<HTMLUListElement>();
  private resizeDebounceId: number;
  private resizeDebounce: () => void;

  constructor(props: SideBarProps) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      wide: isWide()
    };
  }

  componentDidMount() {
    this.resizeDebounce = () => {
      if (this.resizeDebounceId) {
        cancelAnimationFrame(this.resizeDebounceId);
      }
      this.resizeDebounceId = requestAnimationFrame(() => {
        this.handleResize();
      });
    };
    window.addEventListener('resize', this.resizeDebounce);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeDebounce);
  }

  private handleResize() {
    const wide = isWide();

    if (wide === this.state.wide) {
      return;
    }

    this.setState({ wide });
  }

  private onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    const { onDismiss } = this.props;

    if (keyname(e.which) !== 'esc') {
      return;
    }

    onDismiss();
  }

  private handleClickOutside() {
    const { show, onDismiss } = this.props;
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
      ? ['SideBar--show', 'SideBar--show SideBar--active']
      : ['SideBar--show', ''];

    this.setState({ animateClass: first });
    // css3 animations require transition classes to be added on separate tics
    setTimeout(() => {
      this.setState({ animateClass: second });
      const firstFocusable =
        show &&
        this.navList?.current?.querySelector<HTMLElement>(focusableSelector);

      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100); // slide out animation requires a min timeout of 100ms
  }

  render() {
    const { animateClass, wide } = this.state;
    // disabling no-unused-vars to prevent onDismiss from being passed through to dom element
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      children,
      className,
      show,
      onDismiss,
      navProps,
      ...other
    } = this.props;
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    return (
      <Fragment>
        <ClickOutsideListener onClickOutside={this.handleClickOutside}>
          <nav {...navProps}>
            <ul
              className={classNames('SideBar', className, animateClass)}
              {...other}
              ref={this.navList}
              onKeyDown={this.onKeyDown}
            >
              {children}
            </ul>
          </nav>
        </ClickOutsideListener>
        <Scrim show={!wide && show} />
      </Fragment>
    );
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
  }
}

import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { isBrowser } from '../../utils/is-browser';

export interface SkipLinkProps {
  target: string;
  skipText?: string;
  targetText?: string;
}

interface SkipLinkState {
  currentClass: string;
}

/**
 * <SkipLink target={'#foo'} />
 */
export default class SkipLink extends React.Component<
  SkipLinkProps,
  SkipLinkState
> {
  static defaultProps = {
    skipText: 'Skip to',
    targetText: 'Main Content'
  };

  constructor(props: SkipLinkProps) {
    super(props);

    this.state = { currentClass: '' };

    this.onClick = this.onClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  render() {
    const { currentClass } = this.state;
    const { target, skipText, targetText, ...other } = this.props;

    return (
      <nav className={classNames('SkipLink', currentClass)} {...other}>
        <a
          href={target}
          className="SkipLink__link"
          onClick={this.onClick}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          <span className="SkipLink__item--first">{skipText}</span>
          <span className="SkipLink__item--second">
            <Icon type="triangle-right" />
            {targetText}
          </span>
        </a>
      </nav>
    );
  }

  private onClick() {
    if (!isBrowser()) {
      return;
    }
    const element = document.querySelector(this.props.target) as HTMLElement;

    if (element) {
      element.tabIndex = -1;
      element.focus();
    }
  }

  private onFocus() {
    this.setState({ currentClass: 'SkipLink--active' });

    setTimeout(() => {
      this.setState({
        currentClass: 'SkipLink--active SkipLink--fade'
      });
    });
  }

  private onBlur() {
    this.setState({ currentClass: 'SkipLink--active' });

    setTimeout(() => {
      this.setState({ currentClass: '' });
    });
  }
}

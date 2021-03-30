import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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

  static propTypes = {
    // enforce a valid id hash string (example: '#foo')
    target: (
      props: SkipLinkProps,
      propName: keyof SkipLinkProps,
      componentName: string
    ) => {
      const value = props[propName];
      if (!value || typeof value !== 'string' || value[0] !== '#') {
        return new Error(
          `Invalid prop ${propName} supplied to ${componentName} (must be string starting with "#")`
        );
      }
    },
    skipText: PropTypes.string,
    targetText: PropTypes.string
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
          <span className="SkipLink__item--second">{targetText}</span>
        </a>
      </nav>
    );
  }

  private onClick() {
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

import React from 'react';
import PropTypes from 'prop-types';

export interface ScrimProps {
  show: boolean;
}

interface ScrimState {
  animationClass: string;
  destroy: boolean;
}

export default class Scrim extends React.Component<ScrimProps, ScrimState> {
  private el: HTMLDivElement | null;

  static propTypes = {
    show: PropTypes.bool.isRequired
  };

  constructor(props: ScrimProps) {
    super(props);

    this.state = {
      animationClass: '',
      destroy: !props.show
    };
  }

  componentDidMount() {
    if (this.props.show) {
      this.fadeIn();
    }
  }

  fadeIn() {
    this.setState({ destroy: false }, () => {
      this.setState({
        animationClass: 'dqpl-scrim-show'
      });

      // using setTimeout because css transitions require us to add the classes separately
      setTimeout(() => {
        if (!this.el) {
          return;
        }

        this.setState({
          animationClass: 'dqpl-scrim-show dqpl-scrim-fade-in'
        });
      });
    });
  }

  fadeOut() {
    this.setState({ animationClass: 'dqpl-scrim-show' }, () => {
      // using setTimeout because css transitions require us to add the classes separately
      setTimeout(() => {
        this.setState({ animationClass: '' }, () => {
          this.setState({ destroy: true });
        });
      }, 100);
    });
  }

  componentDidUpdate(prevProps: ScrimProps) {
    const { show } = this.props;
    const changed = typeof show !== 'undefined' && prevProps.show !== show;

    if (changed) {
      if (!prevProps.show) {
        return this.fadeIn();
      }

      this.fadeOut();
    }
  }

  render() {
    const { animationClass, destroy } = this.state;

    if (destroy) {
      return null;
    }

    return (
      <div
        ref={el => (this.el = el)}
        className={`dqpl-scrim ${animationClass}`}
      />
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { render } from 'react-dom';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  // TODO: allowed "types" should be defined here (intellisense, etc)
  type: string;
}

export interface IconState {
  IconSVG: React.ComponentType<any> | null;
}

class Icon extends React.Component<IconProps, IconState> {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string.isRequired
  };

  static displayName = 'Icon';

  state: IconState = {
    IconSVG: null
  };

  private loadIcon(type: string) {
    const [, name] = type.match(/(.*)-(right|left|up|down)$/) || ['', type];
    import(`./icons/${name}.svg`)
      .then(({ default: IconSVG }) => {
        this.setState({ IconSVG });
      })
      .catch(ex => {
        console.error(`Could not find icon type "${type}".`);
        this.setState({ IconSVG: null });
      });
  }

  componentDidMount() {
    this.loadIcon(this.props.type);
  }

  componentDidUpdate(prevProps: IconProps) {
    const { type } = this.props;
    if (prevProps.type !== type) {
      this.loadIcon(type);
    }
  }

  render() {
    const { label, type, className, ...other } = this.props;
    const { IconSVG } = this.state;
    const [, name, direction] = type.match(/(.*)-(right|left|up|down)$/) || [
      '',
      type
    ];

    const data = {
      ...other,
      'aria-hidden': !label,
      className: classNames('Icon', `Icon--${type}`, className, {
        [`Icon__${direction}`]: !!direction
      })
    };

    if (label) {
      data['aria-label'] = label;
    }

    return <div {...data}>{IconSVG && <IconSVG />}</div>;
  }
}

export default Icon;

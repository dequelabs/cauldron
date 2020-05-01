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
  private el;
  static propTypes: {
    show: PropTypes.Validator<boolean>;
  };
  constructor(props: ScrimProps);
  componentDidMount(): void;
  fadeIn(): void;
  fadeOut(): void;
  componentDidUpdate(prevProps: ScrimProps): void;
  render(): JSX.Element | null;
}
export {};

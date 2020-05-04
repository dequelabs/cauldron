import React, { Component } from 'react';
import PropTypes from 'prop-types';
export interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  mainRef?: React.Ref<HTMLDivElement>;
}
export default class Main extends Component<MainProps> {
  static defaultProps: {
    mainRef: () => void;
  };
  static propTypes: {
    children: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    mainRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
  };
  render(): JSX.Element;
}

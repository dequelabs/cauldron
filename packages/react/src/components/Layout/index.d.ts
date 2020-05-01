import React from 'react';
import PropTypes from 'prop-types';
export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  layoutRef?: React.Ref<HTMLDivElement>;
}
export default class Layout extends React.Component<LayoutProps> {
  static defaultProps: {
    layoutRef: () => void;
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
    layoutRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
  };
  render(): JSX.Element;
}

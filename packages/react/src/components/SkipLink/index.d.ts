import React from 'react';
import PropTypes from 'prop-types';
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
  static defaultProps: {
    skipText: string;
    targetText: string;
  };
  static propTypes: {
    target: (
      props: SkipLinkProps,
      propName: 'target' | 'skipText' | 'targetText',
      componentName: string
    ) => Error | undefined;
    skipText: PropTypes.Requireable<string>;
    targetText: PropTypes.Requireable<string>;
  };
  constructor(props: SkipLinkProps);
  render(): JSX.Element;
  private onClick;
  private onFocus;
  private onBlur;
}
export {};

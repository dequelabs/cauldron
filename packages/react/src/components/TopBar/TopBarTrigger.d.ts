import React from 'react';
import PropTypes from 'prop-types';
interface TopBarTriggerProps {
  onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  menuItemRef?: React.Ref<HTMLLIElement>;
}
export default class TopBarTrigger extends React.Component<TopBarTriggerProps> {
  static defaultProps: {
    onClick: () => void;
    onKeyDown: () => void;
  };
  static propTypes: {
    onClick: PropTypes.Requireable<(...args: any[]) => any>;
    onKeyDown: PropTypes.Requireable<(...args: any[]) => any>;
  };
  constructor(props: TopBarTriggerProps);
  private onKeyDown;
  render(): JSX.Element;
}
export {};

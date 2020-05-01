import React from 'react';
import PropTypes from 'prop-types';
import { OptionsMenuProps } from './OptionsMenu';
export interface OptionsMenuListProps
  extends Omit<OptionsMenuProps, 'trigger'> {
  className?: string;
}
interface OptionsMenuListState {
  itemIndex: number;
}
export default class OptionsMenuList extends React.Component<
  OptionsMenuListProps,
  OptionsMenuListState
> {
  static defaultProps: {
    closeOnSelect: boolean;
    onSelect: () => void;
  };
  static propTypes: {
    show: PropTypes.Requireable<boolean>;
    children: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    onClose: PropTypes.Validator<(...args: any[]) => any>;
    className: PropTypes.Requireable<string>;
    onSelect: PropTypes.Requireable<(...args: any[]) => any>;
    closeOnSelect: PropTypes.Requireable<boolean>;
    menuRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
  };
  private itemRefs;
  private menuRef;
  constructor(props: OptionsMenuProps);
  componentDidUpdate(
    prevProps: OptionsMenuProps,
    prevState: OptionsMenuListState
  ): void;
  private handleKeyDown;
  private handleClick;
  private handleClickOutside;
  componentDidMount(): void;
  componentWillUnmount(): void;
  render(): JSX.Element;
}
export {};

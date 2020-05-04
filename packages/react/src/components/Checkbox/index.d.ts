import * as React from 'react';
import PropTypes from 'prop-types';
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  name: string;
  label: React.ReactNode;
  value: string;
  checked: boolean;
  onChange: (e: React.FormEvent<HTMLInputElement>, checked: boolean) => void;
  checkboxRef: React.Ref<HTMLInputElement>;
}
interface CheckboxState {
  checked: boolean;
  focused: boolean;
}
export default class Checkbox extends React.Component<
  CheckboxProps,
  CheckboxState
> {
  private checkbox;
  static defaultProps: {
    checked: boolean;
    disabled: boolean;
    onChange: () => void;
    checkboxRef: () => void;
  };
  static propTypes: {
    id: PropTypes.Validator<string>;
    name: PropTypes.Validator<string>;
    label: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    value: PropTypes.Validator<string>;
    checked: PropTypes.Requireable<boolean>;
    disabled: PropTypes.Requireable<boolean>;
    className: PropTypes.Requireable<string>;
    onChange: PropTypes.Requireable<(...args: any[]) => any>;
    checkboxRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
  };
  static displayName: string;
  constructor(props: CheckboxProps);
  componentDidUpdate(prevProps: CheckboxProps): void;
  toggleFocus(): void;
  onCheckboxClick(e: React.ChangeEvent<HTMLInputElement>): void;
  onOverlayClick(): void;
  render(): JSX.Element;
}
export {};

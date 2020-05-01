import React, { ChangeEvent } from 'react';
import PropTypes from 'prop-types';
export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: React.ReactNode;
  error?: React.ReactNode;
  defaultValue?: string;
  onChange: (
    value: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  fieldRef: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  requiredText?: string;
  multiline?: boolean;
}
interface TextFieldState {
  value: string | number | string[] | undefined;
}
export default class TextField extends React.Component<
  TextFieldProps,
  TextFieldState
> {
  static defaultProps: {
    error: null;
    required: boolean;
    defaultValue: null;
    onChange: () => void;
    fieldRef: () => void;
    requiredText: string;
    multiline: boolean;
  };
  static propTypes: {
    label: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    id: PropTypes.Requireable<string>;
    error: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    defaultValue: PropTypes.Requireable<string>;
    value: PropTypes.Requireable<string>;
    onChange: PropTypes.Requireable<(...args: any[]) => any>;
    fieldRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    required: PropTypes.Requireable<boolean>;
    requiredText: PropTypes.Requireable<string>;
    multiline: PropTypes.Requireable<boolean>;
    'aria-describedby': PropTypes.Requireable<string>;
  };
  private inputId;
  private errorId;
  private input;
  constructor(props: TextFieldProps);
  componentDidUpdate(prevProps: TextFieldProps): void;
  render(): JSX.Element;
  onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}
export {};

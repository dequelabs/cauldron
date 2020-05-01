import React from 'react';
import PropTypes from 'prop-types';
import AriaIsolate from '../../utils/aria-isolate';
export interface ToastProps {
  type: 'confirmation' | 'caution' | 'action-needed';
  onDismiss: () => void;
  autoHide?: number;
  dismissText?: string;
  toastRef: React.Ref<HTMLDivElement>;
  show?: boolean;
}
interface ToastState {
  animationClass: string;
  isolator?: AriaIsolate;
}
/**
 * The cauldron toast notification component
 */
export default class Toast extends React.Component<ToastProps, ToastState> {
  static defaultProps: {
    dismissText: string;
    onDismiss: () => void;
    toastRef: () => void;
    show: boolean;
  };
  static propTypes: {
    children: PropTypes.Validator<string | object>;
    type: PropTypes.Validator<string>;
    onDismiss: PropTypes.Requireable<(...args: any[]) => any>;
    autoHide: PropTypes.Requireable<number>;
    dismissText: PropTypes.Requireable<string>;
    toastRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    show: PropTypes.Requireable<boolean>;
  };
  static displayName: string;
  private el;
  constructor(props: ToastProps);
  componentDidMount(): void;
  componentDidUpdate(prevProps: ToastProps): void;
  render(): JSX.Element;
  dismissToast(): void;
  showToast(): void;
}
export {};

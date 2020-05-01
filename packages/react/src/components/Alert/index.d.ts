import React from 'react';
import PropTypes from 'prop-types';
import AriaIsolate from '../../utils/aria-isolate';
export declare const Actions: ({
  children
}: {
  children?: React.ReactNode;
}) => JSX.Element;
export interface AlertProps {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  contentRef: React.Ref<HTMLDivElement>;
  alertRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
  forceAction: boolean;
}
interface AlertState {
  show: boolean;
  isolator?: AriaIsolate;
}
/**
 * Cauldron <Alert /> component
 */
export default class Alert extends React.Component<AlertProps, AlertState> {
  static defaultProps: {
    onClose: () => void;
    forceAction: boolean;
    alertRef: () => void;
    contentRef: () => void;
  };
  static propTypes: {
    className: PropTypes.Requireable<string>;
    children: PropTypes.Validator<string | object>;
    show: PropTypes.Requireable<boolean>;
    contentRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    alertRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    onClose: PropTypes.Requireable<(...args: any[]) => any>;
    forceAction: PropTypes.Requireable<boolean>;
  };
  private content;
  private element;
  state: AlertState;
  constructor(props: AlertProps);
  componentDidMount(): void;
  componentDidUpdate(prevProps: AlertProps): void;
  private attachIsolator;
  render(): JSX.Element | null;
  close(): void;
  focusContent(): void;
}
export {};

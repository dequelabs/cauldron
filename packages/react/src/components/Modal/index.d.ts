import React from 'react';
import PropTypes from 'prop-types';
import AriaIsolate from '../../utils/aria-isolate';
export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  modalRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
  forceAction?: boolean;
  heading: {
    text: string;
    level?: number;
  };
  closeButtonText?: string;
}
interface ModalState {
  isolator?: AriaIsolate;
}
export default class Modal extends React.Component<ModalProps, ModalState> {
  static defaultProps: {
    onClose: () => void;
    forceAction: boolean;
    closeButtonText: string;
    modalRef: () => void;
  };
  static propTypes: {
    className: PropTypes.Requireable<string>;
    show: PropTypes.Requireable<boolean>;
    modalRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    onClose: PropTypes.Requireable<(...args: any[]) => any>;
    forceAction: PropTypes.Requireable<boolean>;
    heading: PropTypes.Validator<object>;
    closeButtonText: PropTypes.Requireable<string>;
  };
  private element;
  private heading;
  constructor(props: ModalProps);
  componentDidMount(): void;
  componentDidUpdate(prevProps: ModalProps): void;
  private attachIsolator;
  render(): JSX.Element | null;
  close(): void;
  handleClickOutside(): void;
  focusHeading(): void;
}
declare const ModalContent: {
  ({ children, ...other }: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
  displayName: string;
};
declare const ModalFooter: {
  ({ children, ...other }: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
  displayName: string;
};
export { ModalContent, ModalFooter };

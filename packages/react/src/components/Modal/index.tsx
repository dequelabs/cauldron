import React from 'react';
import classnames from 'classnames';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogHeading,
  DialogCloseButton,
  DialogFooter,
  DialogProps
} from '../Dialog';

interface ModalProps extends Omit<DialogProps, 'forceAction'> {
  variant?: 'info';
}

const Modal = ({ children, className, variant, ...other }: ModalProps) => (
  <Dialog
    className={classnames('Modal', className, {
      'Modal--info': variant === 'info'
    })}
    {...other}
    forceAction={false}
  >
    {children}
  </Dialog>
);

const ModalHeader = DialogHeader;
const ModalHeading = DialogHeading;
const ModalCloseButton = DialogCloseButton;
const ModalContent = DialogContent;
const ModalFooter = DialogFooter;

export default Modal;
export {
  Modal,
  ModalHeader,
  ModalHeading,
  ModalCloseButton,
  ModalContent,
  ModalFooter
};

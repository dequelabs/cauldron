import React from 'react';
import classnames from 'classnames';
import { Dialog, DialogContent, DialogFooter, DialogProps } from '../Dialog';

interface ModalProps extends Omit<DialogProps, 'forceAction'> {}

const Modal = ({ children, className, ...other }: ModalProps) => (
  <Dialog
    className={classnames('Modal', className)}
    {...other}
    forceAction={false}
  >
    {children}
  </Dialog>
);

const ModalContent = DialogContent;
const ModalFooter = DialogFooter;

export default Modal;
export { Modal, ModalContent, ModalFooter };

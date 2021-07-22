import React from 'react';
import classnames from 'classnames';
import { Dialog, DialogContent, DialogFooter, DialogProps } from '../Dialog';

interface ModalProps extends Omit<DialogProps, 'forceAction'> {}

const Modal = ({ children, className, heading, ...other }: ModalProps) => {
  console.log('heading in modal', heading);
  return (
    <Dialog
      className={classnames('Modal', className, {
        'plain-modal': heading
      })}
      heading={heading}
      {...other}
      forceAction={false}
    >
      {children}
    </Dialog>
  );
};

const ModalContent = DialogContent;
const ModalFooter = DialogFooter;

export default Modal;
export { Modal, ModalContent, ModalFooter };

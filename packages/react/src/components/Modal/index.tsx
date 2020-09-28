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

const ModalContent = ({
  children,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) => (
  <DialogContent {...other}>{children}</DialogContent>
);

const ModalFooter = ({
  children,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) => (
  <DialogFooter {...other}>{children}</DialogFooter>
);

export default Modal;
export { Modal, ModalContent, ModalFooter };

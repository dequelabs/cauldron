import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogProps } from '../Dialog';

interface ModalProps extends Omit<DialogProps, 'forceAction'> {}

const Modal = ({ children, ...other }: ModalProps) => (
  <Dialog {...other} forceAction={false}>
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

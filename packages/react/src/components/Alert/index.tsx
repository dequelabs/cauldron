import React from 'react';
import classnames from 'classnames';
import Icon from '../Icon';
import { Dialog, DialogContent, DialogFooter, DialogProps } from '../Dialog';

interface AlertProps extends Omit<DialogProps, 'forceAction'> {
  variant?: 'default' | 'warning';
}

const Alert = ({
  children,
  className,
  variant = 'default',
  heading,
  ...other
}: AlertProps) => (
  <Dialog
    className={classnames(
      { Alert__warning: variant === 'warning' },
      'Alert',
      className
    )}
    heading={{
      text: (
        <React.Fragment>
          <Icon type={variant === 'default' ? 'info-circle' : 'caution'} />
          {typeof heading === 'object' && 'text' in heading
            ? heading.text
            : heading}
        </React.Fragment>
      ),
      level:
        typeof heading === 'object' && 'level' in heading
          ? heading.level
          : undefined
    }}
    forceAction={true}
    {...other}
  >
    {children}
  </Dialog>
);

const AlertContent = ({
  children,
  className,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) => (
  <DialogContent {...other}>{children}</DialogContent>
);

const AlertActions = ({
  children,
  className,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) => (
  <DialogFooter {...other}>{children}</DialogFooter>
);

export default Alert;
export { Alert, AlertContent, AlertActions };

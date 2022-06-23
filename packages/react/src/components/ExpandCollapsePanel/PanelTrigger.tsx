import React, { forwardRef, Ref } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon, { IconType } from '../Icon';

export interface PanelTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?:
    | ((props: { open: boolean }) => React.ReactNode)
    | React.ReactElement;
  open?: boolean;
  fullWidth?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  iconExpanded?: IconType;
  iconCollapsed?: IconType;
  hideIcon?: boolean;
  buttonRef?: Ref<HTMLButtonElement>;
}

const PanelTrigger = forwardRef<HTMLButtonElement, PanelTriggerProps>(
  (
    {
      children,
      className,
      open,
      fullWidth,
      onClick,
      buttonRef,
      iconExpanded = 'chevron-down',
      iconCollapsed = 'chevron-right',
      hideIcon = false,
      ...otherProps
    }: PanelTriggerProps,
    ref
  ) => {
    return (
      <button
        className={classnames(
          className ? className : 'ExpandCollapse__trigger',
          fullWidth ? 'fullWidth' : ''
        )}
        type="button"
        aria-expanded={open}
        onClick={onClick}
        ref={buttonRef}
        {...otherProps}
      >
        <div className="ExpandCollapse__trigger-title">
          {typeof children === 'function'
            ? children({ open: !!open })
            : children}
        </div>
        {hideIcon ? '' : <Icon type={open ? iconExpanded : iconCollapsed} />}
      </button>
    );
  }
);

PanelTrigger.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  open: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
};

PanelTrigger.displayName = 'PanelTrigger';

export default React.memo(PanelTrigger);

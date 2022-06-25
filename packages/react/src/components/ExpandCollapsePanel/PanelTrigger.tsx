import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon, { IconType } from '../Icon';

export interface PanelTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: ((props: { open: boolean }) => React.ReactNode) | React.ReactNode;
  open?: boolean;
  fullWidth?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  iconExpanded?: IconType;
  iconCollapsed?: IconType;
}

const PanelTrigger = ({
  children,
  className,
  open,
  fullWidth,
  onClick,
  iconExpanded = 'chevron-down',
  iconCollapsed = 'chevron-right',
  ...otherProps
}: PanelTriggerProps) => {
  return (
    <button
      className={classnames(className, 'ExpandCollapse__trigger', {
        fullWidth: fullWidth
      })}
      type="button"
      aria-expanded={open}
      onClick={onClick}
      {...otherProps}
    >
      <div className="ExpandCollapse__trigger-title">
        {typeof children === 'function' ? children({ open: !!open }) : children}
      </div>
      <Icon type={open ? iconExpanded : iconCollapsed} />
    </button>
  );
};

PanelTrigger.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  open: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  iconExpanded: PropTypes.string,
  iconCollapsed: PropTypes.string
};

PanelTrigger.displayName = 'PanelTrigger';

export default React.memo(PanelTrigger);

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon, { IconType } from '../Icon';

export interface PanelTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ((props: { open: boolean }) => React.ReactNode) | React.ReactNode;
  open?: boolean;
  fullWidth?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  expandedIcon?: IconType;
  collapsedIcon?: IconType;
}

function PanelTrigger({
  children,
  className,
  open,
  fullWidth,
  onClick,
  expandedIcon = 'chevron-down',
  collapsedIcon = 'chevron-right',
  ...other
}: PanelTriggerProps) {
  return (
    <button
      {...other}
      className={classnames(
        'ExpandCollapse__trigger',
        fullWidth ? 'fullWidth' : '',
        className
      )}
      type="button"
      aria-expanded={open}
      onClick={onClick}
    >
      <div className="ExpandCollapse__trigger-title">
        {typeof children === 'function' ? children({ open: !!open }) : children}
      </div>
      <Icon type={open ? expandedIcon : collapsedIcon} />
    </button>
  );
}

PanelTrigger.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  open: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  expandIcon: PropTypes.string,
  collapseIcon: PropTypes.string
};

export default React.memo(PanelTrigger);

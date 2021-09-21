import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../Icon';

export interface PanelTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ((props: { open: boolean }) => React.ReactNode) | React.ReactNode;
  open?: boolean;
  fullWidth?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function PanelTrigger({
  children,
  className,
  open,
  fullWidth,
  onClick,
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
      <Icon type={`chevron-${open ? 'down' : 'right'}`} />
    </button>
  );
}

PanelTrigger.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  open: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default React.memo(PanelTrigger);

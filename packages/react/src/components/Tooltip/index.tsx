import React from 'react';
import PropTypes from 'prop-types';
import RcTooltip from 'rc-tooltip';

export interface TooltipProps {
  placement: string;
  children: React.ReactNode;
  overlay: React.ReactNode;
  id: string;
}

export default function Tooltip({
  placement,
  children,
  overlay,
  id
}: TooltipProps) {
  return (
    <RcTooltip
      placement={placement}
      trigger={['hover', 'focus']}
      overlay={overlay}
      overlayClassName="dqpl-rc-tooltip"
      id={id}
    >
      {children}
    </RcTooltip>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  overlay: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  placement: PropTypes.string
};

Tooltip.defaultProps = { placement: 'top' };

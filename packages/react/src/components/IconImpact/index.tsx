import React from 'react';
import PropTypes from 'prop-types';
import { Placement } from '@popperjs/core';
import classNames from 'classnames';
import TooltipTabstop from '../TooltipTabstop';
import Icon, { IconType } from '../Icon';

export interface IconImpactProps extends React.HTMLAttributes<HTMLDivElement> {
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  className?: string;
  showTooltip?: boolean;
  tooltip?: React.ReactNode;
  tooltipPlacement?: Placement;
}

const impactIconType: Record<string, IconType> = {
  critical: 'chevron-double-up',
  serious: 'chevron-up',
  moderate: 'chevron-down',
  minor: 'chevron-double-down'
};

const IconImpact = React.forwardRef<HTMLDivElement, IconImpactProps>(
  (
    {
      impact,
      showTooltip = true,
      tooltipPlacement = 'auto',
      className,
      ...other
    },
    ref
  ): JSX.Element => {
    const icon = (
      <div
        ref={ref}
        className={classNames('IconImpact', `IconImpact--${impact}`, className)}
        {...other}
      >
        <Icon type={impactIconType[impact]} />
      </div>
    );

    return showTooltip ? (
      <TooltipTabstop
        className="TooltipTabstop--IconImpact"
        placement={tooltipPlacement}
        hideElementOnHidden={true}
        tooltip={impact}
      >
        {icon}
      </TooltipTabstop>
    ) : (
      icon
    );
  }
);

IconImpact.propTypes = {
  // @ts-expect-error
  impact: PropTypes.oneOf(['critical', 'serious', 'moderate', 'minor']),
  showTooltip: PropTypes.bool,
  tooltip: PropTypes.element,
  // @ts-expect-error
  tooltipPlacement: PropTypes.string,

  className: PropTypes.string
};

IconImpact.displayName = 'IconImpact';

export default IconImpact;

import React, { forwardRef } from 'react';

import Badge, { BadgeLabel, BadgeProps } from '../Badge';

import { ContentNode } from '../../types';
import Icon, { IconType } from '../Icon';
import classNames from 'classnames';

type ImpactType = 'critical' | 'serious' | 'moderate' | 'minor';

interface ImpactBadgeProps extends Omit<BadgeProps, 'children'> {
  type: ImpactType;
  label?: ContentNode;
}

const iconByType: { [type in ImpactType]: IconType } = {
  critical: 'chevron-double-up',
  serious: 'chevron-up',
  moderate: 'chevron-down',
  minor: 'chevron-double-down'
};

const typeValues: { [key in ImpactType]: string } = {
  critical: 'Critical',
  serious: 'Serious',
  moderate: 'Moderate',
  minor: 'Minor'
};

const ImpactBadge = forwardRef<HTMLDivElement, ImpactBadgeProps>(
  ({ type, label, className, ...other }, ref) => {
    return (
      <Badge
        className={classNames(`ImpactBadge`, `ImpactBadge--${type}`, className)}
        ref={ref}
        {...other}
      >
        <Icon type={iconByType[type]} />
        <BadgeLabel>{label || 'Impact:'}</BadgeLabel>
        {typeValues[type]}
      </Badge>
    );
  }
);

ImpactBadge.displayName = 'ImpactBadge';

export default ImpactBadge;

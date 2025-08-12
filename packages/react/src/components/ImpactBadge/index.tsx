import React, { forwardRef } from 'react';
import Badge, { BadgeLabel } from '../Badge';
import { ContentNode } from '../../types';
import classNames from 'classnames';

type ImpactType = 'critical' | 'serious' | 'moderate' | 'minor';

interface ImpactBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, 'children'> {
  type: ImpactType;
  label?: ContentNode;
}

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
        {label || (
          <>
            <BadgeLabel>Impact:</BadgeLabel>
            {typeValues[type]}
          </>
        )}
      </Badge>
    );
  }
);

ImpactBadge.displayName = 'ImpactBadge';

export default ImpactBadge;

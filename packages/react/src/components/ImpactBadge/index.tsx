import React, { forwardRef } from 'react';
import { ContentNode } from '../../types';

interface ImpactBadgeProps extends React.HTMLAttributes<HTMLElement> {
  type: 'critical' | 'serious' | 'moderate' | 'minor';
  label?: ContentNode;
}

const ImpactBadge = forwardRef(() => {
  return <div className="ImpactBadge">Serious</div>;
});

ImpactBadge.displayName = 'ImpactBadge';

export default ImpactBadge;

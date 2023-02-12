import React from 'react';
import Demo from '../../../Demo';
import { IconImpact } from '@deque/cauldron-react';
import { className } from '../../../props';

const IconImpactDemo = () => {
  return (
    <div>
      <Demo
        component={IconImpact}
        componentDescription={'Display a symbol image.'}
        states={[
          { impact: 'critical' },
          { impact: 'serious' },
          { impact: 'moderate' },
          { impact: 'minor' }
        ]}
        propDocs={{
          className,
          label: {
            type: 'string'
          },
          type: {
            type: 'string',
            required: true
          }
        }}
      />
    </div>
  );
};
export default IconImpactDemo;

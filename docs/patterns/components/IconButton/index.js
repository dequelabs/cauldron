import React from 'react';
import Demo from '../../../Demo';
import { IconButton } from '@deque/cauldron-react/';

const IconButtonDemo = () => (
  <div>
    <Demo
      component={IconButton}
      states={[
        { icon: 'pencil', label: 'Edit' },
        { icon: 'trash', label: 'Delete', tooltipPlacement: 'bottom' }
      ]}
      propDocs={{
        label: {
          type: 'string',
          required: true
        },
        icon: {
          type: 'string',
          required: true
        },
        tooltipPlacement: {
          type: 'string'
        }
      }}
    />
  </div>
);

export default IconButtonDemo;

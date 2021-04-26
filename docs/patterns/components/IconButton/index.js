import React from 'react';
import Demo from '../../../Demo';
import { IconButton } from '@deque/cauldron-react/';

const IconButtonDemo = () => (
  <div>
    <Demo
      component={IconButton}
      states={[
        { icon: 'pencil', label: 'Edit' },
        { icon: 'pencil', label: 'Edit', variant: 'primary' },
        { icon: 'pencil', label: 'Edit', variant: 'secondary' },
        { icon: 'pencil', label: 'Edit', variant: 'error' },
        { icon: 'pencil', label: 'Edit', variant: 'light' },
        { icon: 'pencil', label: 'Edit', variant: 'dark' },
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

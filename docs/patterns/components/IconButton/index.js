import React from 'react';
import Demo from '../../../Demo';
import { IconButton, Offscreen } from '@deque/cauldron-react/';

const IconButtonDemo = () => (
  <div>
    <Demo
      component={IconButton}
      states={[
        { icon: 'pencil', label: 'Edit' },
        { icon: 'pencil', label: 'Edit', variant: 'primary' },
        {
          icon: 'pencil',
          label: (
            <>
              Edit User
              <Offscreen>Steve</Offscreen>
            </>
          ),
          variant: 'primary'
        },
        {
          icon: 'pencil',
          label: 'Edit',
          variant: 'primary',
          disabled: true
        },
        { icon: 'pencil', label: 'Edit', variant: 'secondary' },
        {
          icon: 'pencil',
          label: 'Edit',
          variant: 'secondary',
          disabled: true
        },
        { icon: 'pencil', label: 'Edit', variant: 'error' },
        { icon: 'trash', label: 'Delete', tooltipPlacement: 'bottom' },
        {
          icon: 'external-link',
          label: 'Anchor',
          tooltipPlacement: 'bottom',
          as: 'a',
          href: '#'
        }
      ]}
      propDocs={{
        as: {
          type: 'ElementType',
          description: 'A component to render the IconButton as',
          default: 'button'
        },
        label: {
          type: 'node',
          required: true
        },
        icon: {
          type: 'string',
          required: true
        },
        tooltipPlacement: {
          type: 'string'
        },
        tooltipVariant: {
          type: 'string'
        },
        tooltipPortal: {
          type: 'HTMLElement | RefObject<HTMLElement>'
        }
      }}
    />
  </div>
);

export default IconButtonDemo;

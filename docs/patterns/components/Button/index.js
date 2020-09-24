import React from 'react';
import Demo from '../../../Demo';
import { Button } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const ButtonDemo = () => (
  <div>
    <Demo
      component={Button}
      states={[
        { children: 'Primary' },
        { children: 'Primary Disabled', disabled: true },
        { children: 'Primary thin', thin: true },
        { children: 'Secondary', variant: 'secondary' },
        {
          children: 'Secondary Disabled',
          variant: 'secondary',
          disabled: true
        },
        { children: 'Secondary thin', variant: 'secondary', thin: true },
        { children: 'Error', variant: 'error' },
        { children: 'Error Disabled', variant: 'error', disabled: true },
        { children: 'Error thin', variant: 'error', thin: true },
        { children: 'Link', variant: 'link' }
      ]}
      propDocs={{
        variant: {
          type: 'string',
          description:
            'Any of the following: "primary", "secondary", "error", "link".',
          default: '"primary"'
        },
        buttonRef: {
          type: 'function',
          description: 'Ref function for the button element'
        },
        children,
        className,
        thin: {
          type: 'boolean',
          description:
            'render button with "thin" modifier (reduces height of button)'
        }
      }}
    />
  </div>
);

export default ButtonDemo;

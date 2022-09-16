import React from 'react';
import Demo from '../../../Demo';
import { Button, Icon } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const ButtonDemo = () => (
  <div>
    <Demo
      component={Button}
      componentDescription={
        'An interactive component that performs a programmable action when activated by the user.'
      }
      states={[
        { children: 'Primary' },
        { children: 'Primary Disabled', disabled: true },
        { children: 'Primary thin', thin: true },
        {
          children: (
            <>
              <Icon type="plus" />
              Primary Icon
            </>
          )
        },
        {
          children: (
            <>
              <Icon type="plus" />
              Primary Icon thin
            </>
          ),
          thin: true
        },
        { children: 'Secondary', variant: 'secondary' },
        {
          children: 'Secondary Disabled',
          variant: 'secondary',
          disabled: true
        },
        { children: 'Secondary thin', variant: 'secondary', thin: true },
        {
          children: (
            <>
              Secondary Icon
              <Icon type="plus" style={{ fill: '#222' }} />
            </>
          ),
          variant: 'secondary'
        },
        {
          children: (
            <>
              Secondary Icon thin
              <Icon type="plus" style={{ fill: '#222' }} />
            </>
          ),
          thin: true,
          variant: 'secondary'
        },
        { children: 'Error', variant: 'error' },
        { children: 'Error Disabled', variant: 'error', disabled: true },
        { children: 'Error thin', variant: 'error', thin: true },
        { children: 'Link', variant: 'link' },
        { children: 'Tag', variant: 'tag' },
        { children: 'Tag Disabled', variant: 'tag', disabled: true }
      ]}
      propDocs={{
        variant: {
          type: 'string',
          description:
            'Any of the following: "primary", "secondary", "error", "link", "tag".',
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

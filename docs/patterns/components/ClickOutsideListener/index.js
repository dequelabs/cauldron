import { Button, ClickOutsideListener } from '@deque/cauldron-react';
import React from 'react';
import Demo from '../../../Demo';

const ClickOutsideListenerDemo = () => (
  <div>
    <Demo
      component={ClickOutsideListener}
      componentDescription={
        'A component wrapper that calls a method when clicking outside the wrapped component.'
      }
      states={[
        {
          children: <Button>Click Inside</Button>,
          onClickOutside: () => alert('You clicked outside of me.')
        }
      ]}
      propDocs={{
        onClickOutside: {
          type: 'function',
          description: 'Function called when a user clicks outside',
          required: 'true'
        }
      }}
    />
  </div>
);

export default ClickOutsideListenerDemo;

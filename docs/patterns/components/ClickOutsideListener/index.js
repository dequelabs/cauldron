import React from 'react';
import { ClickOutsideListener, Code, Button } from '@deque/cauldron-react/';
import PropDocs from '../../../Demo/PropDocs';

const Demo = () => (
  <div>
    <h1>Click Outside Listener</h1>
    <h2>Component Description</h2>
    <p>
      If a user clicks outside of this component on the page, the{' '}
      <code>onClickOutside</code> method will be called.
    </p>
    <h2>Demo</h2>
    <ClickOutsideListener
      onClickOutside={() => alert('You clicked outside of me.')}
    >
      <Button variant="primary">Click Inside</Button>
    </ClickOutsideListener>
    <h2>Code Sample</h2>
    <Code language="javascript" role="region" tabIndex={0}>
      {`
import React from 'react';
import {
  ClickOutsideListener,
  Code,
  Button
} from '@deque/cauldron-react';

const Demo = () => (
  <ClickOutsideListener onClickOutside={() => alert('You clicked outside of me.')}>
    <Button variant="primary">Click Inside</Button>
  </ClickOutsideListener>
);
      `}
    </Code>
    <div className="Demo-props">
      <h2>Props</h2>
      <PropDocs
        docs={{
          onClickOutside: {
            type: 'function',
            description: 'Function called when a user clicks outside',
            required: 'true'
          }
        }}
      />
    </div>
  </div>
);

export default Demo;

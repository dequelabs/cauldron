import React from 'react';
import { ClickOutsideListener, Code, Button } from '@deque/cauldron-react/';

const Demo = () => (
  <div>
    <h1>Click Outside Listener</h1>
    <h2>Demo</h2>
    <ClickOutsideListener
      onClickOutside={() => alert('You clicked outside of me.')}
    >
      <Button variant="primary">Click Inside</Button>
    </ClickOutsideListener>
    <h2>Code Sample</h2>
    <Code language="javascript">
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
  </div>
);

export default Demo;

import React from 'react';
import { ClickOutsideListener, Code } from '../../../../packages/react/src/';

const Demo = () => (
  <div>
    <h1>Click Outside Listener</h1>
    <h2>Demo</h2>
    <ClickOutsideListener
      onClickOutside={() => alert('You clicked outside of me.')}
    >
      <button type="button" className="dqpl-button-primary">
        Click Inside
      </button>
    </ClickOutsideListener>
    <h2>Code Sample</h2>
    <Code language="javascript">
      {`
import React from 'react';
import { ClickOutsideListener } from '@deque/cauldron-react';

const Demo = () => (
  <ClickOutsideListener onClickOutside={() => alert('You clicked outside of me.')}>
    <button type="button" className="dqpl-button-primary">Click Inside</button>
  </ClickOutsideListener>
);
      `}
    </Code>
  </div>
);

export default Demo;

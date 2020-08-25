import React from 'react';
import { Code } from '@deque/cauldron-react/';

const Demo = () => (
  <div>
    <h1>Code</h1>
    <h2>Demo</h2>
    <Code language="javascript">{'var foo = true'}</Code>
    <h2>Code Sample</h2>
    <Code language="javascript">
      {`
import React from 'react';
import {
  Code
} from '@deque/cauldron-react';
<Code language="javascript">{'alert("this is getting too meta");'}/Code>
      `}
    </Code>
  </div>
);

export default Demo;

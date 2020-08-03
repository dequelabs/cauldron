import React from 'react';
import { Code } from '@deque/cauldron-react';

const Home = () => (
  <div>
    <h1>Cauldron React</h1>
    <h2>Installation</h2>
    <Code language="shell">
      {'$ npm install --save @deque/cauldron-react @deque/cauldron-styles'}
    </Code>
    <h2>Usage</h2>
    <Code language="javascript">
      {`
import { Workspace, Button } from '@deque/cauldron-react';
import '@deque/cauldron-styles'; // or in your css you can: @import '@deque/cauldron-styles'
import '@deque/cauldron-react/lib/cauldron.css';

const Foo = () => (
  <Workspace>
    <h1>Hello world</h1>
    <Button>Cauldron is awesome!</Button>
  </Workspace>
);
      `}
    </Code>
  </div>
);

export default Home;

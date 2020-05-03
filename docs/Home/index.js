import React from 'react';
import { Code } from '../../packages/react/src';

const Home = () => (
  <div>
    <h1>Cauldron React</h1>
    <h2>Installation</h2>
    <Code language="shell">{'$ npm install cauldron-react'}</Code>
    <h2>Usage</h2>
    <Code language="javascript">
      {`
import { Workspace, Button } from 'cauldron-react';

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

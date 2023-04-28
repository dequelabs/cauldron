import React from 'react';
import { Code } from '@deque/cauldron-react';
import PropDocs from '../../../Demo/PropDocs';

export default function Layout() {
  return (
    <div>
      <h1 id="main-title">Layout</h1>
      <h2>Component Description</h2>
      <p>
        The Workspace component is a convenience wrapper around the Layout and
        Main components. It is important to note that the layout components{' '}
        <strong>do not</strong> wrap the TopBar or Sidebar components.
      </p>
      <h2>{'Option 1: <Workspace />'}</h2>
      <p>
        Use the <code>workspaceRef</code> and <code>layoutRef</code> attributes.
      </p>
      <h3>Code sample</h3>
      <Code language="javascript" role="region" tabIndex={0}>
        {`
import { Workspace, SideBar, TopBar } from '@deque/cauldron-react';

const App = () => (
  <div class="App">
    <TopBar>...</TopBar>
    <SideBar>...</SideBar>
    <Workspace
      workspaceRef={el => console.log('the main ref is ', el)}
      layoutRef={el => console.log('the layout ref is ', el)}
    >
      <h1 id="main-title">Hello world!</h1>
    </Workspace>
  </div>
);
        `}
      </Code>
      <h2>{'Option 2: <Main /> and <Layout /> components'}</h2>
      <p>
        If you need a more flexible option, compose your own Main and Layout
        components.
      </p>
      <h3>Code sample</h3>
      <Code language="javascript" role="region" tabIndex={0}>
        {`
import { Layout, Main, TopBar, SideBar } from '@deque/cauldron-react';

const App = () => (
  <div class="App">
    <TopBar>...</TopBar>
    <SideBar>...</SideBar>
    <Layout
      layoutRef={el => console.log('the layout ref is ', el)}
    >
      <Main
        mainRef={el => console.log('the main ref is ', el)}
      >
        <h1 id="main-title">Hello world!</h1>
      </Main>
      <footer>I am a footer</footer>
    </Layout>
  </div>
);
        `}
      </Code>
      <div className="Demo-props">
        <h2>Props</h2>
        <PropDocs
          docs={{
            children: {
              type: 'node',
              description: 'The child content',
              required: true
            },
            layoutRef: {
              type: 'function or function.current',
              description: 'Pass a ref to the Layout component',
              default: '() => {}'
            }
          }}
        />
      </div>
    </div>
  );
}

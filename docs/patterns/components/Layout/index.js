import React from 'react';
import { Code } from '@deque/cauldron-react/';

export default function Layout() {
  return (
    <div>
      <h1>Layout</h1>
      <p>There are 2 different ways to configure a cauldron-react layout.</p>
      <p>
        It is important to note that the layout components{' '}
        <strong>do not</strong> wrap the TopBar or Sidebar components.
      </p>
      <h2>{'Option 1: <Workspace />'}</h2>
      <p>
        The Workspace component is a convenience wrapper around the Layout and
        Main components.
      </p>
      <h3>Code sample</h3>
      <Code language="javascript">
        {`
import { Workspace, Sidebar, TopBar } from '@deque/cauldron-react';

const App = () => (
  <div class="App">
    <TopBar>...</TopBar>
    <SideBar>...</SideBar>
    <Workspace
      workspaceRef={el => console.log('the main ref is ', el)}
      layoutRef={el => console.log('the layout ref is ', el)}
    >
      <h1>Hello world!</h1>
    </Workspace>
  </div>
);
        `}
      </Code>
      <h2>{'Option 2: <Main /> and <Layout /> components'}</h2>
      <p>
        This option is a bit more flexible but requires you to compose the 2
        required compoents
      </p>
      <h3>Code sample</h3>
      <Code language="javascript">
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
        <h1>Hello world!</h1>
      </Main>
      <footer>I am a footer</footer>
    </Layout>
  </div>
);
        `}
      </Code>
    </div>
  );
}

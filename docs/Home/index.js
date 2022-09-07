import React from 'react';
import { Code, Link } from '@deque/cauldron-react';

const Home = () => (
  <div>
    <h1>Cauldron React: Accessible Components Library</h1>
    <h2>Purpose</h2>
    <p>
      Friends don't let friends ship inaccessible code! These accessible
      packages include everything from typography and colors, to components like
      custom form controls. The design and interactions shown throughout this
      site are intended to show how Deque provides accessible experiences for
      the users of our own products - through the use of common, accessible
      components like these.
    </p>
    <h2>Usage</h2>
    <p>
      Cauldron React is an accessible React components library. Cauldron Styles
      contains accessible styling for those components and more. Select
      component names in the sidebar for demos!
    </p>
    <h2>Installation</h2>
    <Code>
      {'$ npm install --save @deque/cauldron-react @deque/cauldron-styles'}
    </Code>
    <Code language="javascript" role="region" tabIndex={0}>
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
    <h2>Contribute</h2>
    <p>
      Check out our{' '}
      <Link href="https://github.com/dequelabs/cauldron/blob/develop/CONTRIBUTING.md">
        contribution guide!
      </Link>
    </p>
    <p>
      Found a bug?{' '}
      <Link href="https://github.com/dequelabs/cauldron/issues/new/choose">
        Open an issue!
      </Link>
    </p>
    <h2>More Accessibility Tools</h2>
    <p>
      Don't stop here! Check out{' '}
      <Link href="https://www.deque.com/axe/">Deque Systems' axe Tools</Link>{' '}
      for all your accessibility testing needs!
    </p>
  </div>
);

export default Home;

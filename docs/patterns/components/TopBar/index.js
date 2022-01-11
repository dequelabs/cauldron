import React from 'react';
import { Code } from '@deque/cauldron-react/';

const Demo = () => {
  return (
    <>
      <h1>TopBar</h1>
      <h2>Code Sample</h2>
      <Code language="javascript" role="region" tabIndex={0}>
        {`import React from 'react';
import { TopBar, TopBarMenu, OptionsMenu } from '@deque/cauldron-react';

const Demo = () => (
  <TopBar>
    <TopBarMenu id="top-bar-menu">
      I'm a menu thingy
      <OptionsMenu>
        <li>Item 1</li>
        <li>Item 2</li>
      </OptionsMenu>
    </TopBarMenu>
  </TopBar>
);`}
      </Code>
    </>
  );
};

export default Demo;

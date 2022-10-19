import React from 'react';
import { Code } from '@deque/cauldron-react';

const Demo = () => {
  return (
    <>
      <h1>TopBar</h1>
      <h2>Component Description</h2>
      <p>
        A bar at the top of the page. Typically contains information about the
        page, a navigation menu, and other actions a user can take relating to
        the whole website.
      </p>
      <h2>Demo</h2>
      <p>The TopBar is located at the top of the page.</p>
      <h2>Code Sample</h2>
      <Code language="javascript" role="region" tabIndex={0}>
        {`import React from 'react';
import { TopBar, TopBarMenu, OptionsMenu } from '@deque/cauldron-react';

const Demo = () => (
  <TopBar>
    <TopBarMenu id="top-bar-menu">
      I'm a menu thingy
      <OptionsMenuList onSelect={onSettingsSelect}>
        <li>Item 1</li>
        <li>Item 2</li>
      </OptionsMenuList>
    </TopBarMenu>
    <TopBarItem>
      <a
        href="https://github.com/dequelabs/cauldron"
        className="fa fa-github"
        aria-label="Cauldron on GitHub"
        tabIndex={-1}
      />
    </TopBarItem>
  </TopBar>
);`}
      </Code>
      <div className="Demo-props">
        <h2>Props</h2>
        <PropDocs
          docs={{
            children,
            className
          }}
        />
      </div>
    </>
  );
};

export default Demo;

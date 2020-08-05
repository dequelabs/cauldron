import React, { Component } from 'react';
import {
  OptionsMenu,
  OptionsMenuItem,
  OptionsMenuTrigger,
  Icon,
  Code
} from '@deque/cauldron-react/';

export default class Demo extends Component {
  render() {
    return (
      <div>
        <h1>Options Menu</h1>
        <h2>Demo</h2>
        <h3>Options Menu (Default Trigger)</h3>
        <OptionsMenu
          align="left"
          trigger={triggerProps => (
            <OptionsMenuTrigger {...triggerProps}>
              <Icon type="kabob" label="Options" />
            </OptionsMenuTrigger>
          )}
        >
          <OptionsMenuItem>This</OptionsMenuItem>
          <OptionsMenuItem>That</OptionsMenuItem>
          <OptionsMenuItem>The third</OptionsMenuItem>
          <OptionsMenuItem disabled>And the other</OptionsMenuItem>
        </OptionsMenu>

        <h3>Options Menu (Custom Trigger)</h3>
        <OptionsMenu
          align="left"
          trigger={triggerProps => (
            <button type="button" {...triggerProps}>
              Menu
            </button>
          )}
        >
          <OptionsMenuItem>This</OptionsMenuItem>
          <OptionsMenuItem>That</OptionsMenuItem>
          <OptionsMenuItem>The third</OptionsMenuItem>
          <OptionsMenuItem disabled>And the other</OptionsMenuItem>
        </OptionsMenu>

        <h2>Code Sample</h2>
        <Code language="javascript">
          {`
import React, { Component } from 'react';
import {
  OptionsMenu,
  OptionsMenuItem,
  OptionsMenuTrigger,
  Icon
} from '@deque/cauldron-react';

class Demo extends Component {

  render() {
    const { show } = this.state;

    return (
      <div>
        <h3>Options Menu (Default Trigger)</h3>
        <OptionsMenu
          align="left"
          trigger={triggerProps => (
            <OptionsMenuTrigger {...triggerProps}>
              <Icon type="kabob" label="Options" />
            </OptionsMenuTrigger>
          )}
        >
          <OptionsMenuItem>This</OptionsMenuItem>
          <OptionsMenuItem>That</OptionsMenuItem>
          <OptionsMenuItem>The third</OptionsMenuItem>
          <OptionsMenuItem disabled>And the other</OptionsMenuItem>
        </OptionsMenu>

        <h3>Options Menu (Custom Trigger)</h3>
        <OptionsMenu
          align="left"
          trigger={triggerProps => (
            <button type="button" {...triggerProps}>Menu</button>
          )}
        >
          <OptionsMenuItem>This</OptionsMenuItem>
          <OptionsMenuItem>That</OptionsMenuItem>
          <OptionsMenuItem>The third</OptionsMenuItem>
          <OptionsMenuItem disabled>And the other</OptionsMenuItem>
        </OptionsMenu>
      </div>
    );
  }
}

          `}
        </Code>
      </div>
    );
  }
}

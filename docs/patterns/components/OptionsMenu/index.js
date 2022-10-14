import React, { Component } from 'react';
import {
  OptionsMenu,
  OptionsMenuItem,
  OptionsMenuTrigger,
  Icon,
  Code
} from '@deque/cauldron-react';
import PropDocs from '../../../Demo/PropDocs';

export default class Demo extends Component {
  render() {
    return (
      <div>
        <h1>Options Menu</h1>
        <h2>Component Description</h2>
        <p>
          A dropdown menu that shows a list of <code>OptionMenuItem</code>{' '}
          components when activated.
        </p>
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
        <Code language="javascript" role="region" tabIndex={0}>
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

        <div className="Demo-props">
          <h2>Props</h2>
          <PropDocs
            docs={{
              separator: {
                type: 'React.Element',
                description: 'Separator dividing each breadcrumb item',
                default: '"/"'
              },
              children,
              className
            }}
          />
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import {
  OptionsMenu,
  OptionsMenuItem,
  OptionsMenuTrigger,
  Icon,
  Code
} from '@deque/cauldron-react';
import PropDocs from '../../../Demo/PropDocs';
import { children, className } from '../../../props';

export default class Demo extends Component {
  render() {
    return (
      <div>
        <h1 id="main-title">Options Menu</h1>
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
              children: {
                type: 'node',
                description: 'The child content',
                required: true
              },
              onClose: {
                type: 'function',
                description:
                  'Function called when the OptionMenu component is closed.',
                default: '() => {}'
              },
              onSelect: {
                type: 'function',
                description:
                  'Function called when a child of the OptionMenu component is selected.',
                default: '() => {}'
              },
              trigger: {
                type: 'node',
                description:
                  'Pass an element that will display when the OptionsMenu component is closed and open it when activated.'
              },
              closeOnSelect: {
                type: 'boolean',
                description: ''
              },
              menuRef: {
                type: ' function or function.current',
                description: 'Pass a ref to the OptionsMenu'
              },
              align: {
                type: 'string',
                description: 'Style your OptionsMenu to align left or right',
                default: 'right'
              },
              show: {
                type: 'boolean',
                description: 'Whether or not to show the opened OptionsMenu'
              },
              id: {
                type: 'string',
                description: 'ID string'
              }
            }}
          />
        </div>
      </div>
    );
  }
}

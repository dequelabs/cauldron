import React, { Component } from 'react';
import Demo from '../../../Demo';
import { Link, Code } from '@deque/cauldron-react';
import { children, className } from '../../../props';

export default class LinkDemo extends Component {
  render() {
    return (
      <div>
        <Demo
          component={Link}
          componentDescription={'A link component with accessible styling.'}
          states={[
            {
              children: 'I am a link!',
              href: '#'
            },
            {
              children: 'I am a link that looks like a primary button',
              href: '#',
              variant: 'button'
            },
            {
              children: 'I am a link that looks like a secondary button',
              href: '#',
              variant: 'button-secondary'
            }
          ]}
          propDocs={{
            children,
            className,
            linkRef: {
              type: 'function',
              description: (
                <div>
                  <p>
                    Ref function. <em>Example:</em>
                  </p>
                  <Code role="region" tabIndex={0}>
                    {'element => this.link = element'}
                  </Code>
                </div>
              )
            },
            variant: {
              type: 'string',
              description: 'Any of the following: "button", "button-secondary".'
            }
          }}
        />
      </div>
    );
  }
}
LinkDemo.displayName = 'LinkDemo';

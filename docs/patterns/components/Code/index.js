import React from 'react';
import { Code } from '@deque/cauldron-react';
import Demo from '../../../Demo';

const CodeDemo = () => (
  <>
    <Demo
      component={Code}
      componentDescription={
        'Displays text styled to indicate that it is computer code.'
      }
      states={[
        {
          children: `// here are some vars
var foo = true;
const number = 1234;
const string = "hello world";
const regex = /^anything$/i;`,
          language: 'javascript',
          DEMO_renderBefore: <h3>javascript</h3>
        },
        {
          children: '<span class="foo">Hello world!</span>',
          language: 'html',
          DEMO_renderBefore: <h3>html</h3>
        },
        {
          children: `.foo,
#foo,
div[class="foo"] {
  color: green;
}`,
          language: 'css',
          DEMO_renderBefore: <h3>css</h3>
        },
        {
          children: '$ npm install --save @deque/cauldron-react',
          DEMO_renderBefore: <h3>(no language prop)</h3>
        },
        {
          children: '<span class="bar">Focusable code block</span>',
          tabIndex: 0,
          DEMO_renderBefore: <h3>Focusable block with tabindex=0</h3>
        }
      ]}
      propDocs={{
        children: {
          type: 'string',
          description:
            'code to be syntax highlighted and rendered in code block',
          required: true
        },
        language: {
          type: 'string',
          description: '"javascript", "css" or "html"'
        },
        focusable: {
          type: 'boolean',
          description:
            'When true, the code component will be focusable, have the landmark role region, and an aria-label or aria-labelledby will be required.'
        }
      }}
    />
  </>
);

export default CodeDemo;

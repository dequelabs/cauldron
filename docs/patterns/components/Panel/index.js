import React from 'react';
import Demo from '../../../Demo';
import { Panel } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const PanelDemo = () => {
  return (
    <div>
      <Demo
        component={Panel}
        states={[
          {
            heading: {
              text: 'Panel Heading',
              level: 2,
              id: 'panel_heading'
            },
            children: 'Panel content.'
          },
          {
            heading: {
              text: 'Collapsed Panel Heading',
              level: 2,
              id: 'collapsed_panel_heading'
            },
            collapsed: true,
            children: 'Collapsed panel content.'
          },
          {
            'aria-labelledby': 'custom-heading',
            children:
              'Content of Panel with a custom heading (see the very bottom)'
          }
        ]}
        propDocs={{
          heading: {
            type: 'object',
            description:
              'Object containing: text, level (optional), id (optional); aria-labelledby is required when there is no heading'
          },
          collapsed: {
            type: 'boolean',
            description: 'Collapse panel into view for smaller viewports',
            default: false
          },
          children: {
            ...children,
            required: true
          },
          className
        }}
      />
      <h2 id="custom-heading">Custom Heading</h2>
    </div>
  );
};

PanelDemo.displayName = 'PanelDemo';
export default PanelDemo;

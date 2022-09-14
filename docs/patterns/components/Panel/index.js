import React from 'react';
import Demo from '../../../Demo';
import { Panel } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const PanelDemo = () => {
  return (
    <div>
      <Demo
        component={Panel}
        whenToUse={'A styled text panel with optional heading.'}
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
            children: 'Content of Panel with no heading'
          }
        ]}
        propDocs={{
          heading: {
            type: 'object',
            description:
              'Object containing: text, level (optional), id (optional)'
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
    </div>
  );
};

PanelDemo.displayName = 'PanelDemo';
export default PanelDemo;

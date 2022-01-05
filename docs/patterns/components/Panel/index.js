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
          }
        ]}
        propDocs={{
          heading: {
            type: 'object',
            required: true,
            description:
              'Object containing: text, level (optional), id (optional)'
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

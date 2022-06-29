import React, { Component, useState } from 'react';
import {
  ExpandCollapsePanel,
  PanelTrigger,
  Code
} from '@deque/cauldron-react/';
import PropDocs from '../../../Demo/PropDocs';
import { children, className } from '../../../props';

const ControlledExpandCollapse = () => {
  const [open, setOpen] = useState(false);
  return (
    <ExpandCollapsePanel open={open} onToggle={() => setOpen(!open)}>
      <PanelTrigger>More bacon info</PanelTrigger>
      Bacon ipsum dolor amet chicken frankfurter shoulder strip steak kielbasa
      ribeye ham hamburger. Fatback kielbasa shoulder, jowl buffalo bacon jerky
      ham pancetta. Strip steak pig chicken, spare ribs buffalo beef tail ground
      round. Pancetta kevin strip steak bacon beef corned beef venison.
    </ExpandCollapsePanel>
  );
};

export default class Demo extends Component {
  render() {
    return (
      <div>
        <h1>Expand Collapse Panel</h1>
        <h2>Demo</h2>
        <ExpandCollapsePanel>
          <PanelTrigger>More bacon info</PanelTrigger>
          Bacon ipsum dolor amet chicken frankfurter shoulder strip steak
          kielbasa ribeye ham hamburger. Fatback kielbasa shoulder, jowl buffalo
          bacon jerky ham pancetta. Strip steak pig chicken, spare ribs buffalo
          beef tail ground round. Pancetta kevin strip steak bacon beef corned
          beef venison.
        </ExpandCollapsePanel>

        <ExpandCollapsePanel>
          <PanelTrigger fullWidth>
            Panel trigger with fullWidth property
          </PanelTrigger>
          Bacon ipsum dolor amet chicken frankfurter shoulder strip steak
          kielbasa ribeye ham hamburger. Fatback kielbasa shoulder, jowl buffalo
          bacon jerky ham pancetta. Strip steak pig chicken, spare ribs buffalo
          beef tail ground round. Pancetta kevin strip steak bacon beef corned
          beef venison.
        </ExpandCollapsePanel>

        <h3>Controlled Component</h3>
        <p>
          If you need to manually control the open/closed state of the panel,
          you can do this by setting the <code>open</code> prop and handling
          changes with <code>onToggle</code>.
        </p>
        <ControlledExpandCollapse />
        <h2>Code Sample</h2>
        <Code language="javascript" role="region" tabIndex={0}>{`
import React, { useState } from 'react';
import { ExpandCollapsePanel, PanelTrigger } from '@deque/cauldron-react';

const ControlledExpandCollapsePanel = () => {
  const [ open, setOpen ] = useState(false)
  return (
    <ExpandCollapsePanel open={open} onToggle={() => setOpen(!open)}>
      <PanelTrigger fullWidth>
        More bacon info
      </PanelTrigger>
      Bacon ipsum dolor amet chicken frankfurter shoulder strip steak
      kielbasa ribeye ham hamburger. Fatback kielbasa shoulder, jowl buffalo
      bacon jerky ham pancetta. Strip steak pig chicken, spare ribs buffalo
      beef tail ground round. Pancetta kevin strip steak bacon beef corned
      beef venison.
    </ExpandCollapsePanel>
  )
}

const Demo = () => {
  <ExpandCollapsePanel>
    <PanelTrigger>
      More bacon info
    </PanelTrigger>
    Bacon ipsum dolor amet chicken frankfurter shoulder strip steak
    kielbasa ribeye ham hamburger. Fatback kielbasa shoulder, jowl buffalo
    bacon jerky ham pancetta. Strip steak pig chicken, spare ribs buffalo
    beef tail ground round. Pancetta kevin strip steak bacon beef corned
    beef venison.
  </ExpandCollapsePanel>
  <ControlledExpandCollapsePanel />
};
        `}</Code>
        <div className="Demo-props">
          <h2>Props</h2>
          <h3>
            <code>ExpandCollapsePanel</code>
          </h3>

          <PropDocs
            docs={{
              className,
              children,
              open: {
                type: 'boolean',
                description: 'Initial collapsed state of ExpandCollapsePanel',
                default: 'false'
              },
              animationTiming: {
                type: 'number | boolean',
                description:
                  'Animation time of expand/collapse in ms. Animation disabled when set to false.',
                default: 250
              },
              onToggle: {
                type: '(e: React.MouseEvent<HTMLButtonElement>) => void',
                description:
                  'onToggle handler for the panel. The original event object will be passed.',
                default: 'function () {}'
              }
            }}
          />

          <h3>
            <code>PanelTrigger</code>
          </h3>
          <PropDocs
            docs={{
              children,
              className,
              open: {
                type: 'boolean',
                description: 'Initial collapsed state of PanelTrigger',
                default: 'false'
              },
              fullWidth: {
                type: 'string',
                description:
                  'When set to "fullWidth" this component will stretch to the full width of its parent.'
              },
              onClick: {
                type: '(e: React.MouseEvent<HTMLButtonElement>)',
                description:
                  'onClick handler for PanelTrigger. The original event object will be passed.'
              },
              iconExpanded: {
                type: 'string',
                description: 'The Icon to use when open=true.',
                default: 'chevron-down'
              },
              iconCollapsed: {
                type: 'string',
                description: 'The Icon to use when open=false.',
                default: 'chevron-right'
              },
              headingLevel: {
                type: 'string',
                description: 'Used to wrap the trigger in a heading element.',
                default: undefined
              }
            }}
          />
        </div>
      </div>
    );
  }
}

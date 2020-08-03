import React, { Component, useState } from 'react';
import {
  ExpandCollapsePanel,
  PanelTrigger,
  Code
} from '@deque/cauldron-react/';

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
        <h3>Controlled Component</h3>
        <p>
          If you need to manually control the open/closed state of the panel,
          you can do this by setting the <code>open</code> prop and handling
          changes with <code>onToggle</code>.
        </p>
        <ControlledExpandCollapse />
        <h2>Code Sample</h2>
        <Code language="javascript">{`
import React, { useState } from 'react';
import { ExpandCollapsePanel, PanelTrigger } from '@deque/cauldron-react';

const ControlledExpandCollapsePanel = () => {
  const [ open, setOpen ] = useState(false)
  return (
    <ExpandCollapsePanel open={open} onToggle={() => setOpen(!open)}>
      <PanelTrigger>
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
      </div>
    );
  }
}

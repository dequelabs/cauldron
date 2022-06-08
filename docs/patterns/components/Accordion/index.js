import React, { Component, useState } from 'react';
import Demo from '../../../Demo';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  ExpandCollapsePanel,
  PanelTrigger
} from '@deque/cauldron-react/';
import { className } from '../../../props';
import classNames from 'classnames';

export const AccordionDemo = () => {
  return (
    <div>
      <h1>Accordion</h1>
      <h2>Demo</h2>
      <h2>Code Sample</h2>
      {/* <Accordion>
        <AccordionItem>
          <AccordionTrigger>Testing</AccordionTrigger>
          <AccordionPanel>
          Second element</AccordionPanel>
        </AccordionItem>
      </Accordion> */}
      <Test></Test>
      <Test></Test>
    </div>
  );
};

export const Test = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    return setOpen(!open);
  };

  return (
    <div className="max-w">
      <ExpandCollapsePanel
        open={open}
        onToggle={handleOpen}
        className="Accordion__panel"
      >
        <PanelTrigger
          iconExpanded={'triangle-down'}
          iconCollapsed={'triangle-right'}
          className={classNames(
            open ? 'Accordion__trigger--expanded' : '',
            'Accordion__trigger underline'
          )}
        >
          Accordion #1
        </PanelTrigger>
        Insert content here...
      </ExpandCollapsePanel>
    </div>
  );
};

AccordionDemo.displayName = 'AccordionDemo';

export default AccordionDemo;

import React, { useState } from 'react';
import Demo from '../../../Demo';
import {
  Accordion,
  AccordionContainer,
  AccordionTrigger,
  AccordionContent,
  Button
} from '@deque/cauldron-react/';
import classNames from 'classnames';
import './index.css';

export const AccordionDemo = () => {
  return (
    <div>
      <h1>Accordion</h1>
      <h2>Demo</h2>
      <h3>Controlled</h3>
      <ControlledAccordion label="Accordion #1" />
      <ControlledAccordion label="Accordion #2" />
      <h3>Uncontrolled</h3>
      <Accordion>
        <AccordionContainer>
          <AccordionTrigger>Accordion #3</AccordionTrigger>
          <AccordionContent>Here is some content</AccordionContent>
          <Button>Testing</Button>
        </AccordionContainer>
      </Accordion>
      <h2>Code Sample</h2>
    </div>
  );
};

AccordionDemo.displayName = 'AccordionDemo';

const ControlledAccordion = ({ label }) => {
  const [open, setIsOpen] = useState(false);

  return (
    <Accordion>
      <AccordionContainer
        open={open}
        onToggle={() => setIsOpen(!open)}
        setIsOpen={setIsOpen}
        isControlled
      >
        <AccordionTrigger
          className={classNames(
            open ? 'expanded' : '',
            'Accordion__trigger underline'
          )}
          iconExpanded="triangle-down"
          iconCollapsed="triangle-right"
        >
          {label}
        </AccordionTrigger>
        <AccordionContent className="Accordion__panel">
          Here is some content
        </AccordionContent>
      </AccordionContainer>
    </Accordion>
  );
};

export default AccordionDemo;

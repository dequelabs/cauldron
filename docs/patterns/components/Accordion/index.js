import React, { useState } from 'react';
import Demo from '../../../Demo';
import {
  Accordion,
  AccordionContainer,
  AccordionPanelTrigger,
  AccordionContent,
  Checkbox,
  IconButton,
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
          <AccordionPanelTrigger>Accordion #3</AccordionPanelTrigger>
          <AccordionContent className="Accordion__panel">
            Here is some content
          </AccordionContent>
          <Button>Testing</Button>
        </AccordionContainer>
      </Accordion>
      <h3>Advanced</h3>
      <CheckboxAccordion />
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
        <AccordionPanelTrigger
          className={classNames(
            open
              ? 'Accordion__trigger underline expanded'
              : 'Accordion__trigger underline'
          )}
          iconExpanded="triangle-down"
          iconCollapsed="triangle-right"
        >
          {label}
        </AccordionPanelTrigger>
        <AccordionContent className="Accordion__panel">
          Here is some content
        </AccordionContent>
      </AccordionContainer>
    </Accordion>
  );
};

const CheckboxAccordion = () => {
  const [open, setIsOpen] = useState(false);

  return (
    <Accordion>
      <AccordionContainer
        open={open}
        onToggle={() => setIsOpen(!open)}
        iconExpanded="triangle-down"
        iconCollapsed="triangle-right"
        shouldHideIcon
        isControlled
      >
        <AccordionPanelTrigger
          className={classNames(
            open ? 'Accordion__trigger expanded' : 'Accordion__trigger'
          )}
        >
          <div className="checkbox-demo">
            <Checkbox label="Accordion #4" />
            <IconButton
              icon={open ? 'triangle-down' : 'triangle-right'}
              label={open ? 'Close panel' : 'Open panel'}
              tooltipPlacement="left"
            />
          </div>
        </AccordionPanelTrigger>
        <AccordionContent className="Accordion__panel">
          Here is some content
        </AccordionContent>
      </AccordionContainer>
    </Accordion>
  );
};

export default AccordionDemo;

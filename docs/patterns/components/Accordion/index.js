import React, { Component, useEffect, useState } from 'react';
import Demo from '../../../Demo';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  AccordionTwo,
  AccordionContainer,
  AccordionPanelTrigger,
  AccordionContent,
  Checkbox,
  IconButton,
  Button
} from '@deque/cauldron-react/';
import { className } from '../../../props';
import {
  ExpandCollapsePanel,
  PanelTrigger
} from '../../../../packages/react/lib';
import classNames from 'classnames';

export const AccordionDemo = () => {
  return (
    <div>
      <h1>Accordion</h1>
      <h2>Demo</h2>
      <h3>Controlled</h3>
      <ControlledAccordion label="Accordion #1" />
      <ControlledAccordion label="Accordion #2" />
      <h3>Uncontrolled</h3>
      <AccordionTwo>
        <AccordionContainer>
          <AccordionPanelTrigger>Accordion #3</AccordionPanelTrigger>
          <AccordionContent className="Accordion__panel">
            Here is some content
          </AccordionContent>
          <Button>Testing</Button>
        </AccordionContainer>
      </AccordionTwo>
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
    <AccordionTwo>
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
    </AccordionTwo>
  );
};

const CheckboxAccordion = () => {
  const [open, setIsOpen] = useState(false);

  return (
    <AccordionTwo>
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
    </AccordionTwo>
  );
};

export default AccordionDemo;

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
  AccordionContent
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
      <h2>Code Sample</h2>
      {/* <Accordion>
        <AccordionItem>
          <AccordionTrigger open={open} onToggle={() => setIsOpen(!open)}>Testing</AccordionTrigger>
          <AccordionPanel open={open}>Second element</AccordionPanel>
        </AccordionItem>
      </Accordion> */}
      <h3>Controlled</h3>
      <ControlledAccordion />
      <ControlledAccordion />
      {/* <AccordionTwo>
        <AccordionContainer
          open={open}
          onToggle={() => setIsOpen(!open)}
          tabIndex={0}
        >
          <AccordionPanelTrigger
            className={classNames(
              open
                ? 'Accordion__trigger underline expanded'
                : 'Accordion__trigger underline'
            )}
          >
            This is a trigger
          </AccordionPanelTrigger>
          <AccordionContent className="Accordion__panel">
            Here is some content
          </AccordionContent>
        </AccordionContainer>
      </AccordionTwo>
      <AccordionTwo>
        <AccordionContainer
          open={open}
          onToggle={() => setIsOpen(!open)}
          tabIndex={0}
        >
          <AccordionPanelTrigger
            className={classNames(
              open
                ? 'Accordion__trigger underline expanded'
                : 'Accordion__trigger underline'
            )}
          >
            This is a trigger
          </AccordionPanelTrigger>
          <AccordionContent className="Accordion__panel">
            Here is some content
          </AccordionContent>
        </AccordionContainer>
      </AccordionTwo> */}
      <h3>Uncontrolled</h3>
      <AccordionTwo>
        <AccordionContainer>
          <AccordionPanelTrigger className="Accordion__trigger">
            This is a trigger
          </AccordionPanelTrigger>
          <AccordionContent className="Accordion__panel">
            Here is some content
          </AccordionContent>
        </AccordionContainer>
      </AccordionTwo>
    </div>
  );
};

AccordionDemo.displayName = 'AccordionDemo';

const ControlledAccordion = () => {
  const [open, setIsOpen] = useState(false);

  return (
    <AccordionTwo>
      <AccordionContainer
        open={open}
        onToggle={() => setIsOpen(!open)}
        tabIndex={0}
      >
        <AccordionPanelTrigger
          className={classNames(
            open
              ? 'Accordion__trigger underline expanded'
              : 'Accordion__trigger underline'
          )}
        >
          This is a trigger
        </AccordionPanelTrigger>
        <AccordionContent className="Accordion__panel">
          Here is some content
        </AccordionContent>
      </AccordionContainer>
    </AccordionTwo>
  );
};

export default AccordionDemo;

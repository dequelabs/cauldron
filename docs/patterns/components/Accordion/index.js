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
  const [open, setIsOpen] = useState(true);
  useEffect(() => {
    console.log('value of open', open);
  }, [open]);

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
      <AccordionTwo>
        <AccordionContainer open={open} onToggle={() => setIsOpen(!open)}>
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

export default AccordionDemo;

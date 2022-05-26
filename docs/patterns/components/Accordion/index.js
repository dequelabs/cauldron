import React, { Component } from 'react';
import Demo from '../../../Demo';
import {
  Accordion,
  AccordionItem,
  AccordionPanel
} from '@deque/cauldron-react/';
import { className } from '../../../props';

export const AccordionDemo = () => {
  return (
    <div>
      <h1>Accordion</h1>
      <h2>Demo</h2>
      <h2>Code Sample</h2>
      <Accordion>Testing</Accordion>
      <AccordionItem />
      <Accordion>
        <AccordionItem>Second element</AccordionItem>
        <AccordionItem>Third element</AccordionItem>
      </Accordion>
    </div>
  );
};

AccordionDemo.displayName = 'AccordionDemo';

export default AccordionDemo;

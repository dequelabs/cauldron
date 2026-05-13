import React from 'react';
import figma from '@figma/code-connect';
import { Accordion, AccordionTrigger, AccordionContent } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=107-4348&m=dev';

figma.connect(Accordion, FIGMA_URL, {
  props: {
    open: figma.boolean('Expanded', { true: true, false: undefined })
  },
  example: ({ open }) => (
    <Accordion open={open}>
      <AccordionTrigger>Heading</AccordionTrigger>
      <AccordionContent>Panel content</AccordionContent>
    </Accordion>
  )
});

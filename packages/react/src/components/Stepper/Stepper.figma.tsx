import React from 'react';
import figma from '@figma/code-connect';
import { Stepper, Step } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=349-10784&m=dev';

figma.connect(Stepper, FIGMA_URL, {
  example: () => (
    <Stepper>
      <Step status="complete">Step 1</Step>
      <Step status="current">Step 2</Step>
      <Step status="future">Step 3</Step>
    </Stepper>
  )
});

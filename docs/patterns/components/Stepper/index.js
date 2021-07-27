import React, { Component } from 'react';
import Demo from '../../../Demo';
import { Stepper, Step, TooltipTabstop } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const StepperDemo = () => (
  <div>
    <Demo
      customImport="import { Stepper, Step } from '@deque/cauldron-react'"
      component={Stepper}
      states={[
        {
          children: (
            <>
              <Step status="complete">Visible label</Step>
              <Step status="current" tooltip={<span>I am a tooltip</span>} />
              <Step status="future">3</Step>
            </>
          )
        }
      ]}
      propDocs={{
        children: {
          ...children,
          required: true
        },
        className
      }}
    />
  </div>
);

StepperDemo.displayName = 'StepperDemo';
export default StepperDemo;

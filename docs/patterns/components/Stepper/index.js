import React, { useState, useRef, useEffect } from 'react';
import Demo from '../../../Demo';
import { Stepper, Step, Button } from '@deque/cauldron-react/';
import { children, className } from '../../../props';
import './index.css';

const getStatus = (targetIndex, currentIndex) => {
  if (targetIndex === currentIndex) {
    return 'current';
  }

  return targetIndex < currentIndex ? 'complete' : 'future';
};

const StepperDemo = () => {
  const next = useRef(null);
  const prev = useRef(null);
  const [lastClicked, setLastClicked] = useState(null);
  const [currentStepper1Index, setCurrentStepper1Index] = useState(0);

  const onStepper1Next = () => {
    setLastClicked('next');
    setCurrentStepper1Index(currentStepper1Index + 1);
  };

  const onStepper1Prev = () => {
    setLastClicked('prev');
    setCurrentStepper1Index(currentStepper1Index - 1);
  };

  useEffect(() => {
    if (!lastClicked) {
      return;
    }

    let focusTarget;

    if (lastClicked === 'next') {
      focusTarget = currentStepper1Index === 2 ? prev : next;
    } else {
      focusTarget = currentStepper1Index === 0 ? next : prev;
    }

    focusTarget.current?.focus();
  }, [currentStepper1Index]);

  return (
    <div>
      <Demo
        customImport="import { Stepper, Step } from '@deque/cauldron-react'"
        component={Stepper}
        states={[
          {
            children: (
              <>
                <Step status={getStatus(0, currentStepper1Index)}>
                  Select all stuff/things/such
                </Step>
                <Step status={getStatus(1, currentStepper1Index)}>
                  Analyze the stuff
                </Step>
                {/* <Step status="current" tooltip={<span>I am a tooltip</span>} /> */}
                <Step status={getStatus(2, currentStepper1Index)}>
                  Review all of the things, stuff, such and etc.
                </Step>
              </>
            ),
            DEMO_hide_renderAfterBefore: true,
            DEMO_renderAfter: (
              <div className="StepActions">
                <Button
                  thin
                  variant="secondary"
                  onClick={onStepper1Prev}
                  disabled={currentStepper1Index === 0}
                  ref={prev}
                >
                  BACK
                </Button>
                <Button
                  thin
                  variant="secondary"
                  onClick={onStepper1Next}
                  disabled={currentStepper1Index === 2}
                  ref={next}
                >
                  NEXT
                </Button>
                <p>
                  <strong>NOTE:</strong> it is important to convey step status
                  information to assistive technology.{' '}
                  <code>aria-current="step"</code> is applied to the{' '}
                  <code>
                    {'<Step />'} with <code>status="current"</code>
                  </code>
                  .
                </p>
              </div>
            )
          },
          {
            children: (
              <>
                <Step
                  status="complete"
                  tooltip={
                    <>
                      <div>Step 1: Foo</div>
                      <div>Status: Complete</div>
                    </>
                  }
                />
                <Step
                  status="current"
                  tooltip={
                    <>
                      <div>Step 2: Bar</div>
                      <div>Status: Current</div>
                    </>
                  }
                />
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
};

StepperDemo.displayName = 'StepperDemo';
export default StepperDemo;

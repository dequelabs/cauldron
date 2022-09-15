import React, { useRef } from 'react';
import Demo from '../../../Demo';
import {
  Tooltip,
  TooltipHead,
  TooltipContent,
  Button,
  Code,
  TextField,
  Line
} from '@deque/cauldron-react/';
import './index.css';

const DemoTooltip = () => {
  const top = useRef();
  const bottom = useRef();
  const left = useRef();
  const right = useRef();
  const topInfo = useRef();
  const bottomInfo = useRef();
  const leftInfo = useRef();
  const rightInfo = useRef();
  const password = useRef();

  return (
    <div className="tooltip-demo">
      <Demo
        component={Tooltip}
        componentDescription={
          'A small text box that gives more information about a UI element when a user hovers over or focuses it.'
        }
        states={[]}
        propDocs={{
          target: {
            type: 'Ref | HTMLElement',
            description: 'The target element to attach the tooltip to.',
            required: true
          },
          show: {
            type: 'boolean',
            // See: https://github.com/dequelabs/cauldron/issues/546
            description:
              'Manually control the show state of the tooltip. (Note: there is a known issue where only the initial value of `show` is respected.)'
          },
          placement: {
            type: 'string',
            description:
              'The position of the tooltip relative to its target element.',
            required: false,
            defaultValue: "'auto'"
          },
          variant: {
            type: 'string',
            description: 'The style of tooltip to display.',
            required: false,
            defaultValue: "'text'"
          },
          portal: {
            type: 'Ref | HTMLElement',
            description: 'The parent element to place the Tooltip in.',
            required: false,
            defaultValue: 'document.body'
          }
        }}
      >
        <p>
          Cauldron’s Tooltip relies on{' '}
          <a href="https://popper.js.org/" className="popper-link">
            Popper
          </a>{' '}
          to position tooltips dynamically.
        </p>
        <h3>Text Tooltips</h3>
        <div>
          <Button variant="secondary" buttonRef={top}>
            Top
          </Button>
          <Tooltip target={top} placement="top">
            On top
          </Tooltip>

          <Button variant="secondary" buttonRef={bottom}>
            Bottom
          </Button>
          <Tooltip target={bottom} placement="bottom">
            On bottom
          </Tooltip>

          <Button variant="secondary" buttonRef={left}>
            Left
          </Button>
          <Tooltip target={left} placement="left">
            On your left
          </Tooltip>

          <Button variant="secondary" buttonRef={right}>
            Right
          </Button>
          <Tooltip target={right} placement="right">
            On your right
          </Tooltip>
        </div>
        <h3>Info Tooltips</h3>
        <div>
          <Button variant="secondary" buttonRef={topInfo}>
            Top
          </Button>
          <Tooltip variant="info" target={topInfo} placement="top">
            Here's an informational tooltip with more content on top.
          </Tooltip>

          <Button variant="secondary" buttonRef={bottomInfo}>
            Bottom
          </Button>
          <Tooltip variant="info" target={bottomInfo} placement="bottom">
            Here’s an informational tooltip with more content on bottom.
          </Tooltip>

          <Button variant="secondary" buttonRef={leftInfo}>
            Left
          </Button>
          <Tooltip variant="info" target={leftInfo} placement="left">
            Here’s an informational tooltip with more content on your left.
          </Tooltip>

          <Button variant="secondary" buttonRef={rightInfo}>
            Right
          </Button>
          <Tooltip variant="info" target={rightInfo} placement="right">
            Here's an informational tooltip with more content on your right.
          </Tooltip>
        </div>

        <h3>Big tooltips</h3>
        <p>Used for more verbose tooltips</p>
        <div className="Form">
          <TextField fieldRef={password} label="Password" />
          <Tooltip variant="big" target={password} placement="auto">
            <TooltipHead>Password requirements</TooltipHead>
            <Line />
            <TooltipContent>
              <ul>
                <li>The character length should be long or whatever.</li>
                <li>
                  You need Lower-case, Upper-case, Super-case, and Basket-case.
                </li>
                <li>
                  Special characters are good, but remember all characters are
                  special in their own way
                </li>
                <li>
                  Make sure your passwords match...that should be obvious.
                </li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>
        <h2>Code Samples</h2>
        <Code language="javascript" role="region" tabIndex={0}>
          {`import React from 'react';
import { Tooltip, Button } from '@deque/cauldron-react';

const Demo = () => {
  const tooltipTargetRef = useRef()
  const tooltipInfoTargetRef = useRef()
  return (
    <div>
      <Button buttonRef={tooltipTargetRef}>Tooltip trigger</Button>
      <Tooltip target={tooltipTargetRef} placement="right">
        Tooltip content (I align to the right of the trigger!)
      </Tooltip>

      <Button buttonRef={tooltipInfoTargetRef}>Tooltip trigger</Button>
      <Tooltip target={tooltipInfoTargetRef} placement="right" variant="info">
        Tooltip content (I align to the right of the trigger!)
      </Tooltip>
    </div>
  )
};`}
        </Code>

        <p>
          <code>&lt;Tooltip /&gt;</code> will auto-generate <code>id</code> for
          the tooltip and <code>aria-describedby</code> for the target if no id
          is provided for the tooltip. For more fine-tuned control of the target
          description, you can provide your own <code>id</code> and{' '}
          <code>aria-describedby</code> attributes.
        </p>

        <Code language="javascript" role="region" tabIndex={0}>
          {`<Button
  aria-describedby="tooltip someotherid"
  buttonRef={ref}
>
  Tooltip trigger
</Button>
<Tooltip id="tooltip" target={ref}>
  Tooltip content
</Tooltip>`}
        </Code>
      </Demo>
    </div>
  );
};

export default DemoTooltip;

import React from 'react';
import Demo from '../../../Demo';
import { TooltipTabstop, Code } from '@deque/cauldron-react/';
import './index.css';

const DemoTooltipTabstop = () => {
  return (
    <div className="tooltip-tabstop-demo">
      <Demo
        component={TooltipTabstop}
        componentDescription={
          'An accessible tooltip for non-interactive elements.'
        }
        states={[]}
        propDocs={{
          children: {
            type: 'ReactNode',
            description: 'Child content of the button tabstop element.',
            required: true
          },
          tooltip: {
            type: 'ReactNode',
            description: 'Child content of the tooltip component.',
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
            description: 'The parent element to place the tooltip in.',
            required: false,
            defaultValue: 'document.body'
          }
        }}
      >
        <h2>When to Use:</h2>
        <ul>
          <li>An icon that provides additional information about something</li>
          <li>
            A progress component with non-interactive steps that needs to
            provide additional information about each step
          </li>
        </ul>
        <ol className="progress">
          <li>
            <TooltipTabstop tooltip={<div>Step 1: Current</div>}>
              1
            </TooltipTabstop>
          </li>
          <li>
            <TooltipTabstop tooltip={<div>Step 2: Future</div>}>
              2
            </TooltipTabstop>
          </li>
          <li>
            <TooltipTabstop tooltip={<div>Step 3: Future</div>}>
              3
            </TooltipTabstop>
          </li>
        </ol>

        <h2>Code Samples</h2>
        <Code language="javascript" role="region" tabIndex={0}>
          {`import React from 'react';
  import { TooltipTabstop } from '@deque/cauldron-react';

  const Demo = () => {
    return (
      <ol className="progress">
        <li>
          <TooltipTabstop tooltip={<div>Step 1: Current</div>}>
            1
          </TooltipTabstop>
        </li>
        <li>
          <TooltipTabstop tooltip={<div>Step 2: Future</div>}>
            2
          </TooltipTabstop>
        </li>
        <li>
          <TooltipTabstop tooltip={<div>Step 3: Future</div>}>
            3
          </TooltipTabstop>
        </li>
      </ol>
    )
  };`}
        </Code>
      </Demo>
    </div>
  );
};

export default DemoTooltipTabstop;

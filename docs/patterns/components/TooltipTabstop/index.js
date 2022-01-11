import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Demo from '../../../Demo';
import { TooltipTabstop, Code } from '@deque/cauldron-react/';
import './index.css';

const DemoTooltipTabstop = () => {
  return (
    <div className="tooltip-tabstop-demo">
      <h1>Tooltip Tabstop</h1>

      <p>
        <code>TooltipTabstop</code> is a composite component built on top of{' '}
        <Link to="./Tooltip" className="tooltip-link">
          Tooltip
        </Link>{' '}
        allowing for accessible tooltips on non-interactive elements.
      </p>

      <p>Some examples of where this might be used over a standard Tooltip:</p>

      <ul>
        <li>
          A <code>?</code> icon that provides additional information about
          something
        </li>
        <li>
          A progress component with non-interactive steps that needs to provide
          additional information about each step
        </li>
      </ul>

      <p>
        <code>TooltipTabstop</code> accepts all the same props as{' '}
        <code>Tooltip</code>, except for <code>target</code>
      </p>

      <h2>Demo</h2>

      <ol className="progress">
        <li>
          <TooltipTabstop tooltip={<div>Step 1: Current</div>}>
            1
          </TooltipTabstop>
        </li>
        <li>
          <TooltipTabstop tooltip={<div>Step 2: Future</div>}>2</TooltipTabstop>
        </li>
        <li>
          <TooltipTabstop tooltip={<div>Step 3: Future</div>}>3</TooltipTabstop>
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

      <Demo
        component={TooltipTabstop}
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
          }
        }}
      />
    </div>
  );
};

export default DemoTooltipTabstop;

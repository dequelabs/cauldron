import React from 'react';
import { Tooltip, Button, Code } from '@deque/cauldron-react/';
import './index.css';

const Demo = () => (
  <div className="tooltip-demo">
    <h1>Tooltip</h1>
    <h2>Demo</h2>
    <Tooltip overlay={<span>Tooltip aligned above trigger</span>} id="tool-top">
      <Button secondary aria-describedby="tool-top">
        Top
      </Button>
    </Tooltip>
    <Tooltip
      overlay={<span>Tooltip aligned to the right of trigger</span>}
      id="tool-right"
      placement="right"
    >
      <Button secondary aria-describedby="tool-right">
        Right
      </Button>
    </Tooltip>
    <Tooltip
      overlay={<span>Tooltip aligned below the trigger</span>}
      id="tool-bottom"
      placement="bottom"
    >
      <Button secondary aria-describedby="tool-bottom">
        Bottom
      </Button>
    </Tooltip>
    <Tooltip
      overlay={<span>Tooltip aligned to the left of trigger</span>}
      id="tool-left"
      placement="left"
    >
      <Button secondary aria-describedby="tool-left">
        Left
      </Button>
    </Tooltip>
    <p>
      These tooltips
      <Tooltip
        overlay={
          <span>
            Adjusts alignment automatically based on available space in the
            viewport.
          </span>
        }
        id="tool-definition"
      >
        <span className="DefinitionButton">
          <button aria-describedby="tool-definition">auto-adjust</button>
        </span>
      </Tooltip>
      , so you do not have to worry about offscreen tooltips!
    </p>
    <h2>Code Sample</h2>
    <Code language="javascript">
      {`
import React from 'react';
import { Tooltip, Button } from '@deque/cauldron-react';

const Demo = () => (
  <Tooltip
    overlay={<span>Tooltip content (I align to the right of the trigger!)</span>}
    id='tooltip-demo'
    placement='right'
  >
    <Button secondary aria-describedby='tooltip-demo'>Tooltip trigger</Button>
  </Tooltip>
);
      `}
    </Code>
  </div>
);

export default Demo;

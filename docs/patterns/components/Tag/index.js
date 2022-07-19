import React from 'react';
import { Tag, TagLabel, Code } from '@deque/cauldron-react/';
import './index.css';
import PropDocs from '../../../Demo/PropDocs';

const TagDemo = () => {
  return (
    <div className="Demo">
      <h1>Tags</h1>
      <Code>{`import {Tag} from '@deque/cauldron-react'`}</Code>
      <h2>Examples</h2>
      <h3>Default</h3>
      <Tag>Value</Tag>
      <Code role="region" tabIndex={0}>{`<Tag>
  Value
</Tag>`}</Code>
      <h3>With Label</h3>
      <Tag>
        <>
          <TagLabel>Label: </TagLabel>
          value
        </>
      </Tag>
      <Code role="region" tabIndex={0}>
        {`<Tag>
  <>
    <TagLabel>Label: </TagLabel>
    value
  </>
</Tag>`}
      </Code>
      <h3>Toggleable</h3>
      <ToggleTag />
      <Code language="javascript" role="region" tabIndex={0}>
        {`const ToggleTag = () => {
  
  const [toggleState, setToggleState] = React.useState(false);
  const handleClick = () => {
    setToggleState(!toggleState);
  };

  return (
      <Tag variant="toggle" onToggle={handleClick}>
        <>
          <TagLabel>Toggle: </TagLabel>
          <span>{toggleState ? 'ON' : 'OFF'}</span>
        </>
    </Tag>
  );
};`}
      </Code>
      <div className="Demo-props">
        <h2>Props</h2>
        <PropDocs
          docs={{
            children: {
              type: 'node',
              description: 'The child content',
              required: true
            },
            className: {
              type: 'string',
              description: 'Class name string',
              required: false
            },
            onToggle: {
              type: 'function',
              description:
                'Callback function that gets invoked when the toggle button is clicked; required when variant is "toggle"',
              required: false
            },
            variant: {
              type: 'string',
              description:
                'The variant/type of tag; options are: "default" and "toggle"',
              default: 'default'
            }
          }}
        />
      </div>
    </div>
  );
};

TagDemo.displayName = 'TagDemo';
export default TagDemo;

const ToggleTag = () => {
  const [toggleState, setToggleState] = React.useState(false);
  const handleClick = () => {
    setToggleState(!toggleState);
  };

  return (
    <Tag variant="toggle" onToggle={handleClick}>
      <>
        <TagLabel>Toggle: </TagLabel>
        <span>{toggleState ? 'ON' : 'OFF'}</span>
      </>
    </Tag>
  );
};

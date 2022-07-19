import React, { Component } from 'react';
import Demo from '../../../Demo';
import { Tag, TagLabel } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

export default class TagDemo extends Component {
  render() {
    return (
      <div>
        <Demo
          component={Tag}
          states={[
            {
              children: 'Value'
            },
            {
              children: (
                <>
                  <TagLabel>Label: </TagLabel>value
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
        <ToggleTag />
      </div>
    );
  }
}
TagDemo.displayName = 'TagDemo';

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

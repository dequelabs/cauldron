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
                  <TagLabel>Label: </TagLabel>Value
                </>
              )
            },
            {
              variant: 'dismiss',
              children: (
                <>
                  <TagLabel>Label: </TagLabel>Value
                </>
              )
            }
          ]}
          propDocs={{
            children: {
              ...children,
              required: true
            },
            className,
            variant: {
              type: 'string'
            },
            onDismiss: {
              type: 'function',
              description:
                'A function that allows users to take actions in addition to closing the tag'
            }
          }}
        />
      </div>
    );
  }
}
TagDemo.displayName = 'TagDemo';

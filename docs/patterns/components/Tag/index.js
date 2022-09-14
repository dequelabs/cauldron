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
          componentDescription={
            'Styled text intended for keywords used as tags.'
          }
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
      </div>
    );
  }
}
TagDemo.displayName = 'TagDemo';

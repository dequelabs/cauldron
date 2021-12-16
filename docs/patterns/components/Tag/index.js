import React, { Component } from 'react';
import Demo from '../../../Demo';
import { Tag, TagLabel } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

export default class TagDemo extends Component {
  constructor() {
    super();

    this.state = {
      isActive: true
    };

    this.toggleIsActive = this.toggleIsActive.bind(this);
  }

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
              variant: 'toggle',

              children: <TagLabel>Label: </TagLabel>
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

  toggleIsActive() {
    this.setState(({ isActive }) => {
      return { isActive: !isActive };
    });
  }
}
TagDemo.displayName = 'TagDemo';

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
              toggleState: this.state.isActive,
              onToggle: this.toggleIsActive,
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
              type: 'string',
              description: 'Tag variants include "dismiss" and "toggle"'
            },
            onDismiss: {
              type: 'function',
              description:
                'A function that allows users to take actions in addition to closing the tag'
            },
            toggleState: {
              type: 'boolean',
              description:
                'Indicator of the toggle state; required for "toggle" variant'
            },
            onToggle: {
              type: 'function',
              description:
                'A function that toggles the tag; required for "toggle" variant'
            },
            buttonLabel: {
              type: 'string',
              description:
                'Aria-label for toggle tag; required for "toggle" variant'
            },
            toggleOnText: {
              type: 'string',
              description: 'Customized text that replaces the default "ON"'
            },
            toggleOffText: {
              type: 'string',
              description: 'Customized text that replaces the default "OFF"'
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

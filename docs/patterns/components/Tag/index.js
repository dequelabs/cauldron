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
              toggleBase: this.state.isActive,
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
            toggleValue: {
              type: 'boolean',
              description:
                'A value that determines whether the switch is on or off; required for "toggle" variant'
            },
            onToggle: {
              type: 'function',
              description:
                'A function that toggles the value of toggleValue; required for "toggle" variant'
            },
            buttonLabel: {
              type: 'string',
              description:
                'aria-label for toggle tag; required for "toggle" variant'
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

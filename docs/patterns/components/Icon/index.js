import React, { Component } from 'react';
import Demo from '../../../Demo';
import { Icon, Code } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

export default class IconDemo extends Component {
  render() {
    return (
      <div>
        <Demo
          component={Icon}
          states={[
            {
              type: 'arrow-left'
            },
            {
              type: 'arrow-right'
            },
            {
              type: 'arrow-up'
            },
            {
              type: 'arrow-down'
            },
            {
              type: 'bolt'
            },
            {
              type: 'checkbox-checked'
            },
            {
              type: 'checkbox-unchecked'
            },
            {
              type: 'chevron-double-right'
            },
            {
              type: 'chevron-double-left'
            },
            {
              type: 'chevron-double-up'
            },
            {
              type: 'chevron-double-down'
            },
            {
              type: 'chevron-up'
            },
            {
              type: 'chevron-down'
            },
            {
              type: 'chevron-left'
            },
            {
              type: 'chevron-right'
            },
            {
              type: 'close'
            },
            {
              type: 'code'
            },
            {
              type: 'eye'
            },
            {
              type: 'exchange'
            },
            {
              type: 'external-link'
            },
            {
              type: 'flag'
            },
            {
              type: 'gears'
            },
            {
              type: 'hamburger-menu'
            },
            {
              type: 'info-circle'
            },
            {
              type: 'kabob'
            },
            {
              type: 'list'
            },
            {
              type: 'menu'
            },
            {
              type: 'plus'
            },
            {
              type: 'question-circle'
            },
            {
              type: 'radio-checked'
            },
            {
              type: 'radio-unchecked'
            },
            {
              type: 'run-again'
            },
            {
              type: 'star'
            },
            {
              type: 'sun'
            },
            {
              type: 'trash'
            },
            {
              type: 'target'
            }
          ].sort((a, b) => a.type.localeCompare(b.type))}
          propDocs={{
            className,
            label: {
              type: 'string'
            },
            type: {
              type: 'string',
              required: true
            }
          }}
        />
      </div>
    );
  }
}
IconDemo.displayName = 'IconDemo';

import React, { Component } from 'react';
import Demo from '../../../Demo';
import { Icon, iconTypes } from '@deque/cauldron-react/';
import { className } from '../../../props';

export default class IconDemo extends Component {
  render() {
    return (
      <div>
        <Demo
          component={Icon}
          componentDescription={'Display a symbol image.'}
          states={iconTypes
            .map(type => ({ type }))
            .sort((a, b) => a.type.localeCompare(b.type))}
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

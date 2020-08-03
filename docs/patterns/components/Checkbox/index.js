import React, { Component } from 'react';
import Demo from '../../../Demo';
import { className } from '../../../props';
import { Checkbox } from '@deque/cauldron-react/';

export default class CheckboxDemo extends Component {
  state = {
    mangoChecked: false
  };

  onMangoToggle = () => {
    const { mangoChecked } = this.state;
    this.setState({
      mangoChecked: !mangoChecked
    });
  };

  handleMangoChange = (e, mangoChecked) => {
    this.setState({ mangoChecked });
  };

  render() {
    return (
      <Demo
        component={Checkbox}
        states={[
          {
            id: 'demo-checkbox-1',
            name: 'demo-checkbox-1',
            label: 'Demo checkbox 1',
            value: '1'
          },
          {
            id: 'demo-checkbox-2',
            name: 'demo-checkbox-2',
            label: 'Demo checkbox 2 (default checked)',
            value: '2',
            checked: true
          },
          {
            id: 'demo-checkbox-3',
            name: 'demo-checkbox-3',
            label: 'Demo checkbox 3 (disabled)',
            value: '3',
            disabled: true
          }
        ]}
        propDocs={{
          className,
          id: {
            type: 'string',
            description: 'The id to be set on the input[type=checkbox] element',
            required: true
          },
          name: {
            type: 'string',
            description:
              'The name to be set on the input[type=checkbox] element',
            required: true
          },
          label: {
            type: 'string',
            description: "The text of the checkbox's label",
            required: true
          },
          value: {
            type: 'string',
            description:
              'The value to be set on the input[type=checkbox] element',
            required: true
          },
          checked: {
            type: 'boolean',
            description:
              'If the checkbox should be checked, which allows it to be "controlled"'
          },
          disabled: {
            type: 'boolean',
            description: 'If the checkbox should be disabled'
          },
          checkboxRef: {
            type: 'function',
            description: 'Ref function for the input[type=checkbox] element'
          }
        }}
      />
    );
  }
}

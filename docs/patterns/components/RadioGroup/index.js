import React, { Component } from 'react';
import Demo from '../../../Demo';
import { RadioGroup, FieldWrap } from '@deque/cauldron-react/';
import FieldWrapNotice from '../../../FieldWrapNotice';

const labelDescription =
  'A label for the radio group is required. This means you must provide either an aria-label or aria-labelledby prop.';

export default class RadioGroupDemo extends Component {
  state = {
    value: 'yes'
  };

  onChange = ({ value }) => this.setState({ value });

  render() {
    const { value } = this.state;
    return (
      <FieldWrap>
        <FieldWrapNotice />
        <Demo
          component={RadioGroup}
          states={[
            {
              defaultValue: 'tuesday',
              name: 'pizza',
              DEMO_renderBefore: <h3 id="pizza-label">Do you like pizza?</h3>,
              'aria-labelledby': 'pizza-label',
              defaultValue: 'tuesday',
              radios: [
                { id: 'yes', value: 'yes', label: 'Yes' },
                { id: 'no', value: 'no', label: 'No', disabled: true },
                { id: 'tuesday', value: 'tuesday', label: 'Only on Tuesdays' }
              ]
            },
            {
              value,
              name: 'gyros',
              DEMO_renderBefore: <h3 id="gyros-label">Do you like gyros?</h3>,
              'aria-labelledby': 'gyros-label',
              radios: [
                { id: 'gyros-yes', value: 'yes', label: 'Yes!!' },
                { id: 'gyros-no', value: 'no', label: 'Nope.' },
                {
                  id: 'gyros-friday',
                  value: 'friday',
                  label: 'Only on fridays'
                }
              ]
            }
          ]}
          propDocs={{
            radios: {
              type: 'array',
              required: true,
              description:
                'Array of objects containing: label, value (optional) and any supported HTMLInputElement properties'
            },
            'aria-label': {
              type: 'string',
              description: labelDescription
            },
            'aria-labelledby': {
              type: 'string',
              description: labelDescription
            },
            name: {
              type: 'string',
              required: false
            },
            className: {
              type: 'string',
              required: false
            },
            defaultValue: {
              type: 'any (The DOM API casts this to a string)',
              required: false,
              description:
                'the default value of the radio group (applied when <RadioGroup /> is mounted)'
            },
            value: {
              type: 'any (The DOM API casts this to a string)',
              required: false,
              description:
                'Use when "controlled" radios are desired. Caller is responsible for managing the selected/checked state of the radio group'
            },
            onChange: {
              type: 'function',
              required: false,
              description:
                'This is required if using "controlled" input; otherwise it is optional',
              defaultValue: '() => {}'
            }
          }}
        />
      </FieldWrap>
    );
  }
}

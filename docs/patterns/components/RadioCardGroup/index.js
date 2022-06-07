import React, { Component } from 'react';
import Demo from '../../../Demo';
import { RadioCardGroup, FieldWrap } from '@deque/cauldron-react/';
import FieldWrapNotice from '../../../FieldWrapNotice';

const labelDescription =
  'A label for the radio card group is required. This means you must provide either an aria-label or aria-labelledby prop.';

export default class RadioCardGroupDemo extends Component {
  state = {
    value: 'yes',
    cardImg: <img src="https://via.placeholder.com/150" alt="" />,
    cardIcon: 'check-circle'
  };

  render() {
    return (
      <FieldWrap>
        <FieldWrapNotice />
        <Demo
          component={RadioCardGroup}
          states={[
            {
              name: 'pizza',
              DEMO_renderBefore: <h3 id="pizza-label">Do you like pizza?</h3>,
              defaultValue: 'tuesday',
              'aria-labelledby': 'pizza-label',
              radios: [
                {
                  id: 'yes',
                  value: 'yes',
                  label: 'Yes',
                  cardImg: <img src="https://via.placeholder.com/150" alt="" />,
                  cardIcon: 'check-circle'
                },
                {
                  id: 'no',
                  value: 'no',
                  label: 'No',
                  disabled: true,
                  cardImg: (
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="red" />
                    </svg>
                  ),
                  cardIcon: 'check-circle'
                },
                {
                  id: 'tuesday',
                  value: 'tuesday',
                  label: 'Only on Tuesdays',
                  cardImg: (
                    <div
                      style={{
                        backgroundColor: 'green',
                        height: 100,
                        width: 100,
                        borderRadius: 50
                      }}
                    ></div>
                  ),
                  cardIcon: 'check-circle'
                }
              ]
            }
          ]}
          propDocs={{
            radios: {
              type: 'array',
              required: true,
              description:
                'Array of objects containing: label, cardImg, cardIcon (see IconTypes), value (optional), and any supported HTMLInputElement properties'
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

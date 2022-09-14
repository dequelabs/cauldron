import React, { useState } from 'react';
import { Select, FieldWrap } from '@deque/cauldron-react/';
import './index.css';
import Demo from '../../../Demo';
import FieldWrapNotice from '../../../FieldWrapNotice';

const options = [
  { key: 'monday', value: 'Monday' },
  { key: 'tuesday', value: 'Tuesday' },
  { key: 'wednesday', value: 'Wednesday' },
  { key: 'thursday', value: 'Thursday' },
  { key: 'friday', value: 'Friday' },
  { key: 'saturday', value: 'Saturday', disabled: true },
  { key: 'sunday', value: 'Sunday' }
];
const yesNoOptions = [
  { key: 'yes', value: 'yes' },
  { key: 'no', value: 'no' }
];

const SelectDemo = () => {
  const [currentValue, setCurrentValue] = useState('Maybe');

  return (
    <FieldWrap className="SelectDemo">
      <FieldWrapNotice />
      <Demo
        component={Select}
        componentDescription={
          'A form element that lets users select a choice from a dropdown list.'
        }
        states={[
          {
            label: 'Do you like yogurt?',
            options: [
              { key: 'yes', value: 'Yes' },
              { key: 'no', value: 'No' },
              { key: 'maybe', value: 'Maybe' }
            ],
            value: currentValue,
            onChange: e => setCurrentValue(e.target.value),
            DEMO_renderBefore: <h3>Controlled select</h3>
          },
          {
            label: 'Day',
            options,
            defaultValue: 'Friday',
            DEMO_renderBefore: <h3>Uncontrolled select</h3>
          },
          {
            label: 'Foo?',
            required: true,
            options: yesNoOptions,
            DEMO_renderBefore: <h3>Required</h3>
          },
          {
            label: 'Bar?',
            disabled: true,
            options: yesNoOptions,
            DEMO_renderBefore: <h3>Disabled</h3>
          },
          {
            label: 'Baz?',
            required: true,
            error: 'Not enough baz!',
            options: yesNoOptions,
            DEMO_renderBefore: <h3>With error</h3>
          },
          {
            label: 'How many things do you want?',
            children: (
              <>
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </>
            ),
            defaultValue: 2,
            DEMO_renderBefore: <h3>With jsx option children (uncontrolled)</h3>
          }
        ]}
        propDocs={{
          options: {
            type: 'array',
            required: true,
            description:
              'Array of objects containing: key, value, disabled (optional), and label (optional).'
          },
          defaultValue: {
            type: 'any',
            required: false,
            description:
              'The default element value. Use when the component is not controlled.'
          },
          value: {
            type: 'any',
            required: false,
            description:
              'Use for "controlled" selects. Caller is responsible for managing the value of the select element.'
          },
          onChange: {
            type: 'function',
            required: false,
            description:
              'This is required if using "controlled" input; otherwise it is optional',
            defaultValue: '() => {}'
          },
          children: {
            type: 'node',
            description: 'the <option> or <optgroup> children'
          }
        }}
      />
    </FieldWrap>
  );
};

export default SelectDemo;

import React, { Component } from 'react';
import { RadioGroup, Code } from '@deque/cauldron-react/';

export default class Demo extends Component {
  render() {
    return (
      <div>
        <h1>RadioGroup</h1>
        <h2>Demo</h2>
        <h3 id="pizza-label">Do you like pizza?</h3>
        <RadioGroup
          name="pizza"
          aria-labelledby="pizza-label"
          defaultValue="tuesday"
          radios={[
            { id: 'yes', value: 'yes', label: 'Yes' },
            { id: 'no', value: 'no', label: 'No', disabled: true },
            { id: 'tuesday', value: 'tuesday', label: 'Only on Tuesdays' }
          ]}
        />
        <h2>Code Sample</h2>
        <Code language="javascript">
          {`
  import React from 'react';
  import { RadioGroup } from '@deque/cauldron-react';

  const Demo = () => (
    <div>
      <h3 id='pizza-label'>Do you like pizza?</h3>
      <RadioGroup
        name='pizza'
        aria-labelledby='pizza-label'
        defaultValue='tuesday'
        radios={[
          { id: 'yes', value: 'yes', label: 'Yes' },
          { id: 'no', value: 'no', label: 'No', disabled: true },
          { id: 'tuesday', value: 'tuesday', label: 'Only on tuesdays' }
        ]}
        onChange={(value, element) => console.log(value, element)}
      />
    </div>
  );
          `}
        </Code>
      </div>
    );
  }
}

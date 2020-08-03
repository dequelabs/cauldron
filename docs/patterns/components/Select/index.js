import React, { Component } from 'react';
import { Select, Code } from '@deque/cauldron-react/';
import '../../../../packages/styles/select.css';
import './index.css';

export default class Demo extends Component {
  constructor() {
    super();
    this.state = {
      defaultValue: 'Tuesday',
      current: 'Tuesday',
      options: [
        { key: 'monday', value: 'Monday' },
        { key: 'tuesday', value: 'Tuesday' },
        { key: 'wednesday', value: 'Wednesday' },
        { key: 'thursday', value: 'Thursday' },
        { key: 'friday', value: 'Friday' },
        { key: 'saturday', value: 'Saturday', disabled: true },
        { key: 'sunday', value: 'Sunday' }
      ]
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({
      current: e.target.value
    });
  }

  render() {
    return (
      <div className="select-demo">
        <h1>Select</h1>
        <h2>Demo</h2>
        <form onSubmit={this.handleSubmit}>
          <Select
            label="Day"
            required
            defaultValue={this.state.defaultValue}
            onChange={this.onChange}
            options={this.state.options}
          />
          <p>
            <span>Using the </span>
            <code>onChange</code>
            <span> prop, we can easily handle changes in the select list</span>
          </p>
          <div className="current-value">
            <strong>Current value: </strong>
            <span>{this.state.current}</span>
          </div>
        </form>
        <h2>Code Sample</h2>
        <Code language="javascript">
          {`
    import React from 'react';
    import { Select } from '@deque/cauldron-react';

    const Demo = () => (
      <Select
        id="select-demo"
        label="Day"
        required
        defaultValue='Tuesday'
        onChange={e => console.log('Selected: ', e.target.value)}
        options={[
          { key: 'monday', value: 'Monday' },
          { key: 'tuesday', value: 'Tuesday' },
          { key: 'wednesday', value: 'Wednesday' },
          { key: 'thursday', value: 'Thursday' },
          { key: 'friday', value: 'Friday' },
          { key: 'saturday', value: 'Saturday', disabled: true },
          { key: 'sunday', value: 'Sunday' }
        ]}
      />
    );
          `}
        </Code>
      </div>
    );
  }

  handleSubmit = e => {
    e.preventDefault();
    alert('form submitted');
  };
}

import React, { Component } from 'react';
import { Select, Button, Code } from '../../../../packages/react/src/';
import './index.css';

export default class Demo extends Component {
  constructor() {
    super();
    this.state = {
      defaultValue: 'Tuesday',
      current: 'Tuesday',
      options: [
        { value: 'Monday' },
        { value: 'Tuesday' },
        { value: 'Wednesday' },
        { value: 'Thursday' },
        { value: 'Friday' },
        { value: 'Saturday', disabled: true },
        { value: 'Sunday' }
      ]
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    console.log('Selected: ', e.target.value);
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
          <label htmlFor="select-demo">Day</label>
          <Select
            id="select-demo"
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
      <label htmlFor="select-demo">Day</label>
      <Select
        id="select-demo"
        defaultValue='Tuesday'
        onChange={e => console.log('Selected: ', e.target.value)}
        options={[
          { label: 'Monday' },
          { label: 'Tuesday' },
          { label: 'Wednesday' },
          { label: 'Thursday' },
          { label: 'Friday' },
          { label: 'Saturday', disabled: true },
          { label: 'Sunday' }
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

import React, { Component } from 'react';
import { TextField, Button, Code } from '@deque/cauldron-react/';
import './index.css';

export default class Demo extends Component {
  state = {
    error: null
  };

  validate = e => {
    e.preventDefault();
    const isEmpty = !this.input.value.trim();
    this.setState({
      error: isEmpty ? 'Name must not be blank.' : null
    });

    if (isEmpty) {
      this.input.focus();
    }
  };

  render() {
    return (
      <div className="TextField">
        <h1>TextField</h1>
        <p>
          The TextField component can be controlled (using the <em>value</em>{' '}
          and <em>onChange</em> props) or uncontrolled (like traditional HTML
          inputs).
        </p>
        <h2>Demo</h2>
        <form onSubmit={this.validate} noValidate>
          <p id="text-field-help">
            <em>Hint:</em> submit with the name field blank to trigger error!
          </p>
          <TextField
            required
            id="name"
            label="Name"
            aria-describedby="text-field-help"
            error={this.state.error}
            fieldRef={el => (this.input = el)}
          />
          <TextField
            id="favorite-color"
            label="Favorite Color"
            value="green"
            disabled
          />
          <TextField multiline label="Comment" />
          <Button type="submit">Submit</Button>
        </form>
        <h2>Code Sample</h2>
        <Code language="javascript">
          {`
import React from 'react';
import {
  TextField, Button
} from '@deque/cauldron-react';

export default class Demo extends Component {
  state = {
    error: null
  };

  validate = e => {
    e.preventDefault();
    const isEmpty = !this.input.value.trim();
    this.setState({
      error: isEmpty ? 'Name must not be blank.' : null
    });

    if (isEmpty) {
      this.input.focus();
    }
  };

  render() {
    return (
      <form onSubmit={this.validate} noValidate>
        <p id="text-field-help"><em>Hint:</em> submit with the field blank to trigger error!</p>
        <TextField
          required
          id="name"
          label="Name"
          aria-describedby="text-field-help"
          error={this.state.error}
          fieldRef={el => this.input = el}
        />
        <TextField
          id="favorite-color"
          label="Favorite Color"
          value="green"
          disabled
        />
        <TextField multiline label="Comment" />
        <Button type="submit">Submit</Button>
      </form>
    );
  }
}
      `}
        </Code>
      </div>
    );
  }
}

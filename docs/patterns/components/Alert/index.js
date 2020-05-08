import React, { Component } from 'react';
import {
  Button,
  Alert,
  AlertActions,
  Code
} from '../../../../packages/react/src/';

export default class Demo extends Component {
  constructor() {
    super();

    this.state = { showSimpleAlert: false };
    this.toggleSimpleAlert = this.toggleSimpleAlert.bind(this);
  }

  render() {
    const { showSimpleAlert } = this.state;

    return (
      <div>
        <h1>Alert</h1>
        <h2>Demo</h2>
        <Button onClick={this.toggleSimpleAlert}>Simple Alert</Button>
        <Alert onClose={this.toggleSimpleAlert} show={showSimpleAlert}>
          Simple dismissable alert
          <AlertActions>
            <Button onClick={this.toggleSimpleAlert}>Ok</Button>
            <Button secondary={true} onClick={this.toggleSimpleAlert}>
              Cancel
            </Button>
          </AlertActions>
        </Alert>
        <h2>Code Sample</h2>
        <Code langauge="javascript">
          {`
import React, { Component } from 'react';
import { Button, Alert, AlertActions } from '@deque/cauldron-react';

class Demo extends Component {
  constructor() {
    super();

    this.state = { showSimpleAlert: false };
    this.toggleSimpleAlert = this.toggleSimpleAlert.bind(this);
  }

  render() {
    return (
      <div>
        <Button onClick={this.toggleSimpleAlert}>{'Simple Alert'}</Button>
        <Alert
          onClose={this.toggleSimpleAlert}
          show={showSimpleAlert}
        >
          {'Simple dismissable alert'}
          <AlertActions>
            <Button onClick={this.toggleSimpleAlert}>{'Ok'}</Button>
            <Button secondary={true} onClick={this.toggleSimpleAlert}>{'Cancel'}</Button>
          </AlertActions>
        </Alert>
      </div>
    );
  }

  toggleSimpleAlert() {
    this.setState(({showSimpleAlert}) => {
      return { showSimpleAlert: !showSimpleAlert };
    });
  }
}
          `}
        </Code>
      </div>
    );
  }

  toggleSimpleAlert() {
    this.setState(({ showSimpleAlert }) => {
      return { showSimpleAlert: !showSimpleAlert };
    });
  }
}

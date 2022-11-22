import React, { Component } from 'react';
import {
  Button,
  Alert,
  AlertContent,
  AlertActions,
  Code
} from '@deque/cauldron-react/';
import './index.css';
import PropDocs from '../../../Demo/PropDocs';
import { children, className } from '../../../props';

export default class Demo extends Component {
  constructor() {
    super();

    this.state = { showDefaultAlert: false, showWarningAlert: false };
    this.toggleDefaultAlert = this.toggleDefaultAlert.bind(this);
    this.toggleWarningAlert = this.toggleWarningAlert.bind(this);
  }

  render() {
    const { showDefaultAlert, showWarningAlert } = this.state;

    return (
      <div>
        <h1>Alert</h1>
        <h2>Component Description</h2>
        <p>Shows a modal with a message. Optional warning styling.</p>
        <h2>Demo</h2>
        <Button className="AlertDemo__button" onClick={this.toggleDefaultAlert}>
          Default Alert
        </Button>
        <Button className="AlertDemo__button" onClick={this.toggleWarningAlert}>
          Warning Alert
        </Button>
        <Alert heading="Default Alert" show={showDefaultAlert}>
          <AlertContent>Dismissable alert</AlertContent>
          <AlertActions>
            <Button onClick={this.toggleDefaultAlert}>Ok</Button>
            <Button variant="secondary" onClick={this.toggleDefaultAlert}>
              Cancel
            </Button>
          </AlertActions>
        </Alert>
        <Alert variant="warning" heading="Danger Zone" show={showWarningAlert}>
          <AlertContent>Welcome to the danger zone</AlertContent>
          <AlertActions>
            <Button variant="error" onClick={this.toggleWarningAlert}>
              Danger
            </Button>
            <Button variant="secondary" onClick={this.toggleWarningAlert}>
              Nevermind
            </Button>
          </AlertActions>
        </Alert>
        <h2>Code Sample</h2>
        <Code language="javascript" role="region" tabIndex={0}>
          {`
import React, { Component } from 'react';
import { Button, Alert, AlertActions, AlertContent } from '@deque/cauldron-react';

class Demo extends Component {
  constructor() {
    super();

    this.state = { showDefaultAlert: false, showWarningAlert: false };
    this.toggleDefaultAlert = this.toggleDefaultAlert.bind(this);
    this.toggleWarningAlert = this.toggleWarningAlert.bind(this);
  }

  render() {
    return (
      <div>
        <Button onClick={this.toggleDefaultAlert}>Default Alert</Button>
        <Button onClick={this.toggleWarningAlert}>Warning Alert</Button>
        <Alert
          heading="Default Alert"
          show={showDefaultAlert}
        >
          <AlertContent>Dismissable alert</AlertContent>
          <AlertActions>
            <Button onClick={this.toggleDefaultAlert}>Ok</Button>
            <Button variant="secondary" onClick={this.toggleDefaultAlert}>
              Cancel
            </Button>
          </AlertActions>
        </Alert>
        <Alert
          variant="warning"
          heading="Danger Zone"
          show={showWarningAlert}
        >
          <AlertContent>Welcome to the danger zone</AlertContent>
          <AlertActions>
            <Button variant="error" onClick={this.toggleWarningAlert}>
              Let's get dangerous
            </Button>
            <Button variant="secondary" onClick={this.toggleWarningAlert}>
              Nevermind
            </Button>
          </AlertActions>
        </Alert>
      </div>
    );
  }

  toggleDefaultAlert() {
    this.setState(({ showDefaultAlert }) => {
      return { showDefaultAlert: !showDefaultAlert };
    });
  }

  toggleWarningAlert() {
    this.setState(({ showWarningAlert }) => {
      return { showWarningAlert: !showWarningAlert };
    });
  }
}
          `}
        </Code>
        <div className="Demo-props">
          <h2>Props</h2>
          <PropDocs
            docs={{
              children,
              className,
              variant: {
                type: 'string',
                description: 'The style of Alert to display.',
                default: 'default'
              },
              heading: {
                type: 'React.ReactElement<any> or object',
                description:
                  'Displayed in the heading at the top of the Alert. Optional to pass heading level.',
                required: true
              },
              onClose: {
                type: 'function',
                description: 'Function called when the Alert is closed'
              },
              portal: {
                type: 'any',
                description: 'The parent element to place the Alert in.',
                default: 'document.body'
              },
              show: {
                type: 'boolean',
                description: 'Whether or not to show the Alert'
              },
              dialogRef: {
                type: 'function or function.current',
                description: 'Pass a ref to the Alert.'
              }
            }}
          />
        </div>
      </div>
    );
  }

  toggleDefaultAlert() {
    this.setState(({ showDefaultAlert }) => {
      return { showDefaultAlert: !showDefaultAlert };
    });
  }

  toggleWarningAlert() {
    this.setState(({ showWarningAlert }) => {
      return { showWarningAlert: !showWarningAlert };
    });
  }
}

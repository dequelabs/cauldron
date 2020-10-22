import React, { Component } from 'react';
import { Button, Toast, Link } from '@deque/cauldron-react/';
import DemoComponent from '../../../Demo';
import { children } from '../../../props';

export default class Demo extends Component {
  state = {
    type: null
  };

  onTriggerClick(type) {
    this.setState({ type });
  }

  onToastDismiss = dismissed => {
    const { type } = this.state;

    if (dismissed !== type) {
      return;
    }

    this.setState({ type: null }, () => {
      const trigger = this[type];

      if (!trigger) {
        return;
      }

      // return focus back to the dismissed toast's trigger
      trigger.focus();
    });
  };

  render() {
    const { type } = this.state;

    return (
      <DemoComponent
        component={Toast}
        states={[
          {
            type: 'confirmation',
            children: 'Your toast is ready!',
            show: type === 'confirmation',
            onDismiss: () => this.onToastDismiss('confirmation'),
            DEMO_renderAfter: (
              <Button
                onClick={() => this.onTriggerClick('confirmation')}
                buttonRef={el => (this.confirmation = el)}
              >
                Confirmation
              </Button>
            )
          },
          {
            type: 'caution',
            children: 'The toast is getting toasty...',
            onDismiss: () => this.onToastDismiss('caution'),
            show: type === 'caution',
            DEMO_renderAfter: (
              <Button
                variant="secondary"
                onClick={() => this.onTriggerClick('caution')}
                buttonRef={el => (this.caution = el)}
              >
                Caution
              </Button>
            )
          },
          {
            type: 'action-needed',
            children:
              'You burnt the toast! Check yourself before you wreck yourself...',
            show: false,
            DEMO_renderAfter: (
              <Button
                variant="error"
                onClick={() => this.onTriggerClick('action-needed')}
                buttonRef={el => (this['action-needed'] = el)}
              >
                Action Needed
              </Button>
            )
          },
          {
            type: 'info',
            children: 'It is getting toasty in here!',
            show: type === 'info',
            onDismiss: () => this.onToastDismiss('info'),
            DEMO_renderAfter: (
              <Button
                variant="secondary"
                onClick={() => this.onTriggerClick('info')}
                buttonRef={el => (this.info = el)}
              >
                Info
              </Button>
            )
          }
        ]}
        propDocs={{
          children,
          show: {
            type: 'boolean',
            description: 'whether or not to show the toast'
          },
          type: {
            type: 'string',
            required: true,
            description: '"confirmation", "caution", or "action-needed"'
          },
          onDismiss: {
            type: 'function',
            description: 'function to be executed when toast is dismissed'
          },
          dismissText: {
            type: 'string',
            description:
              'text to be added as the aria-label of the "x" dismiss button (default: "Dismiss")'
          },
          toastRef: {
            type: 'function',
            description:
              'optional ref function to get a handle on the toast element'
          }
        }}
      >
        <Toast type={'action-needed'} show={type === 'action-needed'}>
          <span>{'You have entered an alternate universe.'}</span>
          <Link href="#" onClick={() => this.onToastDismiss('action-needed')}>
            Go back to non-alternate universe!
          </Link>
        </Toast>
      </DemoComponent>
    );
  }
}

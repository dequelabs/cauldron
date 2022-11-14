import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  Code
} from '@deque/cauldron-react';
import PropDocs from '../../../Demo/PropDocs';
import { children, className } from '../../../props';

export default class Demo extends Component {
  constructor() {
    super();

    this.state = { showSimpleModal: false, showPlainModal: false };
    this.toggleSimpleModal = this.toggleSimpleModal.bind(this);
    this.togglePlainModal = this.togglePlainModal.bind(this);
  }

  render() {
    const { showSimpleModal, showPlainModal } = this.state;

    return (
      <div>
        <h1>Modal</h1>
        <h2>Component Description</h2>
        <p>
          Opens an element within the current window that displays on top of all
          other page content.
        </p>
        <h2>Demo</h2>
        <Button onClick={this.toggleSimpleModal}>Simple Modal</Button>
        <Button onClick={this.togglePlainModal}>Plain Modal</Button>

        <Modal
          show={showPlainModal}
          variant={'info'}
          onClose={this.togglePlainModal}
          heading={{
            text: 'plain modal',
            level: 1
          }}
        >
          <ModalContent>
            <p>This is a plain modal and stuff</p>
            <ul>
              <li>List 1</li>
              <li>List 2</li>
              <li>List 3</li>
              <li>List 4</li>
            </ul>
          </ModalContent>
          <ModalFooter>
            <Button variant="secondary" onClick={this.togglePlainModal}>
              CLOSE
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          show={showSimpleModal}
          heading={{ text: 'Simple Modal' }}
          onClose={this.toggleSimpleModal}
        >
          <ModalContent>
            <p>This is a simple modal and stuff</p>
          </ModalContent>
          <ModalFooter>
            <Button onClick={this.toggleSimpleModal}>Save</Button>
            <Button variant="secondary" onClick={this.toggleSimpleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <h2>Code Sample</h2>
        <Code language="javascript" role="region" tabIndex={0}>
          {`
import React, { Component } from 'react';
import { Button, Modal, ModalContent, ModalFooter } from '@deque/cauldron-react';

class Demo extends Component {
  constructor() {
    super();
    this.state = { showSimpleModal: false };
    this.toggleSimpleModal = this.toggleSimpleModal.bind(this);
  }

  render() {
    const { showSimpleModal, showPlainModal } = this.state;

    return (
      <Button onClick={this.toggleSimpleModal}>Simple Modal</Button>
      <Button onClick={this.togglePlainModal}>Plain Modal</Button>

      <Modal
        show={showSimpleModal}
        heading={{ text: 'Simple Modal' }}
        onClose={this.toggleSimpleModal}
      >
        <ModalContent>
          <p>This is a simple modal and stuff</p>
        </ModalContent>
        <ModalFooter>
          <Button onClick={this.toggleSimpleModal}>Save</Button>
          <Button secondary={true} onClick={this.toggleSimpleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal
        show={showPlainModal}
        variant={'info'}
        onClose={this.togglePlainModal}
        heading={{ text: 'Plain Modal', level: 1 }}
      >
        <ModalContent>
          <p>This is a plain modal and stuff</p>
          <ul>
            <li>List 1</li>
            <li>List 2</li>
            <li>List 3</li>
            <li>List 4</li>
          </ul>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={this.togglePlainModal}>
            CLOSE
          </Button>
        </ModalFooter>
      </Modal>

      );
  }

  toggleSimpleModal() {
    this.setState(({showSimpleModal}) => {
      return { showSimpleModal: !showSimpleModal };
    });
  }

  togglePlainModal() {
    this.setState(({ showPlainModal }) => {
      return { showPlainModal: !showPlainModal };
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
                description: 'The style of Modal to display.',
                default: 'default'
              },
              heading: {
                type: 'React.ReactElement<any> or object',
                description:
                  'Displayed in the heading at the top of the Modal. Optional to pass heading level.',
                required: true
              },
              onClose: {
                type: 'function',
                description: 'Function called when the Modal is closed'
              },
              portal: {
                type: 'any',
                description: 'The parent element to render the Modal within.',
                default: 'document.body'
              },
              show: {
                type: 'boolean',
                description: 'Whether or not to show the Modal'
              },
              dialogRef: {
                type: 'function or function.current',
                description: 'Pass a ref to the Modal.'
              },
              closeButtonText: {
                type: 'string',
                description:
                  "The desired accessible name of the modal's close button.",
                default: 'Close'
              }
            }}
          />
        </div>
      </div>
    );
  }

  toggleSimpleModal() {
    this.setState(({ showSimpleModal }) => {
      return { showSimpleModal: !showSimpleModal };
    });
  }

  togglePlainModal() {
    this.setState(({ showPlainModal }) => {
      return { showPlainModal: !showPlainModal };
    });
  }
}

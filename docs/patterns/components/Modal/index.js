import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  Code
} from '@deque/cauldron-react/';

export default class Demo extends Component {
  constructor() {
    super();

    this.state = { showSimpleModal: false };
    this.toggleSimpleModal = this.toggleSimpleModal.bind(this);
  }

  render() {
    const { showSimpleModal } = this.state;

    return (
      <div>
        <h1>Modal</h1>
        <h2>Demo</h2>
        <Button onClick={this.toggleSimpleModal}>Simple Modal</Button>
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
        <Code langauge="javascript">
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
    const { showSimpleModal } = this.state;

    return (
      <Button onClick={this.toggleSimpleModal}>
        Simple Modal
      </Button>
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
    );
  }

  toggleSimpleModal() {
    this.setState(({showSimpleModal}) => {
      return { showSimpleModal: !showSimpleModal };
    });
  }
}
          `}
        </Code>
      </div>
    );
  }

  toggleSimpleModal() {
    this.setState(({ showSimpleModal }) => {
      return { showSimpleModal: !showSimpleModal };
    });
  }
}

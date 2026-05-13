import React from 'react';
import figma from '@figma/code-connect';
import { Modal } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=144-705&m=dev';

figma.connect(Modal, FIGMA_URL, {
  props: {
    variant: figma.enum('Variant', {
      'Info Modal': 'info'
    }),
    heading: figma.textContent('Heading')
  },
  example: ({ variant, heading }) => (
    <Modal show heading={heading} variant={variant} onClose={() => {}}>
      Modal content
    </Modal>
  )
});

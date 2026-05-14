import React from 'react';
import figma from '@figma/code-connect';
import { Toast } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=119-5623&m=dev';

figma.connect(Toast, FIGMA_URL, {
  props: {
    type: figma.enum('Type', {
      Error: 'error',
      Warning: 'caution',
      Info: 'info'
    })
  },
  example: ({ type }) => <Toast type={type}>Message</Toast>
});

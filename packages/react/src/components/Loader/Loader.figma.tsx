import React from 'react';
import figma from '@figma/code-connect';
import { Loader } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=5493-108&m=dev';

figma.connect(Loader, FIGMA_URL, {
  props: {},
  example: () => <Loader label="Loading" />
});

import React from 'react';
import figma from '@figma/code-connect';
import { LoaderOverlay } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=5493-130&m=dev';

figma.connect(LoaderOverlay, FIGMA_URL, {
  props: {},
  example: () => <LoaderOverlay label="Loading" />
});

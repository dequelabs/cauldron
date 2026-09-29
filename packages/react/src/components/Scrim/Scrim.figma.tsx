import React from 'react';
import figma from '@figma/code-connect';
import { Scrim } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=324-8561&m=dev';

figma.connect(Scrim, FIGMA_URL, {
  props: {},
  example: () => <Scrim show />
});

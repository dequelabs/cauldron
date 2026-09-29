import React from 'react';
import figma from '@figma/code-connect';
import { Line } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=4493-1373&m=dev';

figma.connect(Line, FIGMA_URL, {
  props: {},
  example: () => <Line />
});

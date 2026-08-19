import React from 'react';
import figma from '@figma/code-connect';
import { SearchField } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=852-3579&m=dev';

figma.connect(SearchField, FIGMA_URL, {
  props: {
    label: figma.textContent('Label')
  },
  example: ({ label }) => <SearchField label={label} />
});

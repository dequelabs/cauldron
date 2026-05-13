import React from 'react';
import figma from '@figma/code-connect';
import { EmptyState } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=4894-29059&m=dev';

figma.connect(EmptyState, FIGMA_URL, {
  props: {
    heading: figma.textContent('Heading'),
    description: figma.textContent('Description text')
  },
  example: ({ heading, description }) => (
    <EmptyState heading={heading} description={description} />
  )
});

import React from 'react';
import figma from '@figma/code-connect';
import { FieldGroup } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=5348-2712&m=dev';

figma.connect(FieldGroup, FIGMA_URL, {
  props: {
    label: figma.textContent('Label'),
    description: figma.boolean('Description', {
      true: 'Description',
      false: undefined
    }),
    error: figma.enum('Property 1', {
      Error: 'Error message'
    })
  },
  example: ({ label, description, error }) => (
    <FieldGroup label={label} description={description} error={error}>
      Children
    </FieldGroup>
  )
});

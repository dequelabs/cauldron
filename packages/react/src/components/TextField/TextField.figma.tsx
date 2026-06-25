import React from 'react';
import figma from '@figma/code-connect';
import { TextField } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=8534-4753&m=dev';

figma.connect(TextField, FIGMA_URL, {
  props: {
    label: figma.textContent('Label'),
    description: figma.boolean('Description', {
      true: figma.textContent('Label Description'),
      false: undefined
    }),
    error: figma.enum('State', {
      Error: figma.textContent('errorMessage')
    }),
    required: figma.boolean('Required', { true: true, false: undefined }),
    disabled: figma.enum('State', { Disabled: true }),
    multiline: figma.boolean('Multiline', { true: true, false: undefined })
  },
  example: ({ label, description, error, required, disabled, multiline }) => (
    <TextField
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      multiline={multiline}
    />
  )
});

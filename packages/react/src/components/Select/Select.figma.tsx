import React from 'react';
import figma from '@figma/code-connect';
import { Select } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=8534-4265&m=dev';

figma.connect(Select, FIGMA_URL, {
  props: {
    label: figma.textContent('Label'),
    description: figma.boolean('Description', {
      true: 'Description text',
      false: undefined
    }),
    error: figma.boolean('Error', {
      true: 'Error message',
      false: undefined
    }),
    required: figma.boolean('Required', { true: true, false: undefined }),
    disabled: figma.boolean('Disabled', { true: true, false: undefined })
  },
  example: ({ label, description, error, required, disabled }) => (
    <Select
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      options={[
        { key: '1', value: 'Option 1' },
        { key: '2', value: 'Option 2' }
      ]}
    />
  )
});

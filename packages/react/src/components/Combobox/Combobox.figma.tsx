import React from 'react';
import figma from '@figma/code-connect';
import { Combobox, ComboboxOption } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=8534-4620&m=dev';

figma.connect(Combobox, FIGMA_URL, {
  props: {
    label: figma.textContent('Combo Box Label'),
    description: figma.boolean('Description', {
      true: figma.textContent('Label Description'),
      false: undefined
    }),
    error: figma.enum('State', {
      Error: figma.textContent('errorMessage')
    }),
    required: figma.boolean('Required', { true: true, false: undefined }),
    disabled: figma.enum('State', { Disabled: true })
  },
  example: ({ label, description, error, required, disabled }) => (
    <Combobox
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
    >
      <ComboboxOption>Option 1</ComboboxOption>
      <ComboboxOption>Option 2</ComboboxOption>
    </Combobox>
  )
});

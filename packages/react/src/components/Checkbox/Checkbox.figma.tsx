import React from 'react';
import figma from '@figma/code-connect';
import { Checkbox } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=130-583&m=dev';

figma.connect(Checkbox, FIGMA_URL, {
  props: {
    checked: figma.enum('Checked', { True: true }),
    indeterminate: figma.enum('Indeterminate', { True: true }),
    disabled: figma.enum('Disabled', { True: true }),
    error: figma.enum('Error', { True: 'Error message' }),
    labelDescription: figma.boolean('Label Description#131:7', {
      true: 'Label description',
      false: undefined
    })
  },
  example: ({ checked, indeterminate, disabled, error, labelDescription }) => (
    <Checkbox
      id="checkbox"
      label="Label"
      labelDescription={labelDescription}
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      error={error}
    />
  )
});

import React from 'react';
import figma from '@figma/code-connect';
import { RadioGroup } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=231-2042&m=dev';

figma.connect(RadioGroup, FIGMA_URL, {
  example: () => (
    <RadioGroup
      name="example"
      radios={[{ id: 'option-a', value: 'a', label: 'Option A' }]}
    />
  )
});

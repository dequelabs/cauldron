import React from 'react';
import figma from '@figma/code-connect';
import { Code } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=938-11780&m=dev';

figma.connect(Code, FIGMA_URL, {
  props: {
    allowCopy: figma.boolean('Show Copy', {
      true: true,
      false: undefined
    }),
    label: figma.textContent('Label'),
    children: figma.textContent('Code Container')
  },
  example: ({ allowCopy, label, children }) => (
    <Code allowCopy={allowCopy} label={label}>
      {children}
    </Code>
  )
});

import React from 'react';
import figma from '@figma/code-connect';
import { Tooltip } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=62-3730&m=dev';

figma.connect(Tooltip, FIGMA_URL, {
  props: {
    // Right is the React default placement, so omit it from the mapping.
    placement: figma.enum('Direction', {
      Up: 'top',
      Down: 'bottom',
      Left: 'left'
    })
  },
  example: ({ placement }) => {
    const targetRef = React.useRef<HTMLButtonElement>(null);
    return (
      <Tooltip target={targetRef} placement={placement}>
        Tooltip text
      </Tooltip>
    );
  }
});

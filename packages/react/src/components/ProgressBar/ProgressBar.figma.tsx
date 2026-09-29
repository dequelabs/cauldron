import React from 'react';
import figma from '@figma/code-connect';
import { ProgressBar } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=324-8788&m=dev';

figma.connect(ProgressBar, FIGMA_URL, {
  props: {
    progress: figma.enum('Progress', {
      '0%': 0,
      '25%': 25,
      '50%': 50,
      '75%': 75,
      '100%': 100
    })
  },
  example: ({ progress }) => (
    <ProgressBar aria-label="Progress" progress={progress} />
  )
});

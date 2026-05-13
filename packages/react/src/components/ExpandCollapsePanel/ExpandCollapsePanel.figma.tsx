import React from 'react';
import figma from '@figma/code-connect';
import { ExpandCollapsePanel, PanelTrigger } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=242-6451&m=dev';

figma.connect(ExpandCollapsePanel, FIGMA_URL, {
  props: {
    // Figma's `Collapsed` is the opposite of React's `open`. Default Collapsed=True
    // corresponds to open=undefined (collapsed); Collapsed=False maps to open={true}.
    open: figma.enum('Collapsed', { False: true })
  },
  example: ({ open }) => (
    <ExpandCollapsePanel open={open}>
      <PanelTrigger>Trigger</PanelTrigger>
      Panel content
    </ExpandCollapsePanel>
  )
});

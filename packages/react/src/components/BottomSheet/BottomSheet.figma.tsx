import React from 'react';
import figma from '@figma/code-connect';
import { BottomSheet } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=4122-133&m=dev';

figma.connect(BottomSheet, FIGMA_URL, {
  example: () => (
    <BottomSheet open label="Title" onClose={() => undefined}>
      Content
    </BottomSheet>
  )
});

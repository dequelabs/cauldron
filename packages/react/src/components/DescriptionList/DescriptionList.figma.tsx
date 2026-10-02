import React from 'react';
import figma from '@figma/code-connect';
import {
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
  DescriptionDetails
} from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=240-4209&m=dev';

figma.connect(DescriptionList, FIGMA_URL, {
  props: {
    collapsed: figma.enum('Collapsed', { True: true })
  },
  example: ({ collapsed }) => (
    <DescriptionList collapsed={collapsed}>
      <DescriptionListItem>
        <DescriptionTerm>Term 1</DescriptionTerm>
        <DescriptionDetails>Details 1</DescriptionDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionTerm>Term 2</DescriptionTerm>
        <DescriptionDetails>Details 2</DescriptionDetails>
      </DescriptionListItem>
    </DescriptionList>
  )
});

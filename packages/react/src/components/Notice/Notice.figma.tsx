import React from 'react';
import figma from '@figma/code-connect';
import { Notice } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=235-3430&m=dev';

figma.connect(Notice, FIGMA_URL, {
  props: {
    type: figma.enum('Type', {
      caution: 'caution',
      danger: 'danger'
    }),
    variant: figma.enum('Size', {
      Small: 'condensed'
    }),
    title: figma.textContent('Title')
  },
  example: ({ type, variant, title }) => (
    <Notice type={type} variant={variant} title={title}>
      Body
    </Notice>
  )
});

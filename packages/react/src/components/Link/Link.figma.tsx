import React from 'react';
import figma from '@figma/code-connect';
import { Link } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=30-777&m=dev';

figma.connect(Link, FIGMA_URL, {
  props: {
    children: figma.textContent('Label')
  },
  example: ({ children }) => <Link href="#">{children}</Link>
});

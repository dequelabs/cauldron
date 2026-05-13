import React from 'react';
import figma from '@figma/code-connect';
import { Pagination } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=912-2081&m=dev';

figma.connect(Pagination, FIGMA_URL, {
  example: () => <Pagination totalItems={100} currentPage={3} />
});

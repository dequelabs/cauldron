import React from 'react';
import figma from '@figma/code-connect';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=122-6269&m=dev';

figma.connect(Breadcrumb, FIGMA_URL, {
  example: () => (
    <Breadcrumb aria-label="breadcrumb">
      <BreadcrumbLink href="#">One</BreadcrumbLink>
      <BreadcrumbLink href="#">Two</BreadcrumbLink>
      <BreadcrumbItem>Three</BreadcrumbItem>
    </Breadcrumb>
  )
});

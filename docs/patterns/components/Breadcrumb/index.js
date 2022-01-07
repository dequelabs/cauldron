import React, { createRef } from 'react';
import PropDocs from '../../../Demo/PropDocs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Code
} from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const ButtonDemo = () => (
  <div>
    <h1>Breadcrumb</h1>
    <h2>Examples</h2>

    <Breadcrumb aria-label="Breadcrumb">
      <BreadcrumbLink href="#">One</BreadcrumbLink>
      <BreadcrumbLink href="#">Two</BreadcrumbLink>
      <BreadcrumbLink href="#">Three</BreadcrumbLink>
      <BreadcrumbItem>Four</BreadcrumbItem>
    </Breadcrumb>

    <Code>
      {`<Breadcrumb aria-label="Breadcrumb">
  <BreadcrumbLink href="/one">One</BreadcrumbLink>
  <BreadcrumbLink href="/two">Two</BreadcrumbLink>
  <BreadcrumbLink href="/three">Three</BreadcrumbLink>
  <BreadcrumbItem>Four</BreadcrumbItem>
</Breadcrumb>`}
    </Code>

    <div className="Demo-props">
      <h2>Props</h2>
      <PropDocs
        docs={{
          separator: {
            type: 'React.Element',
            description: 'Separator dividing each breadcrumb item',
            default: '"/"'
          },
          children,
          className
        }}
      />
    </div>
  </div>
);

export default ButtonDemo;

import React from 'react';
import PropDocs from '../../../Demo/PropDocs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Code
} from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const BreadcrumbDemo = () => (
  <div>
    <h1>Breadcrumb</h1>
    <h2>Component Description</h2>
    <p>
      The Breadcrumb component displays a list of links within a hierarchy and
      allows navigation back through them.
    </p>

    <h2>Examples</h2>

    <h3>Basic</h3>

    <Breadcrumb aria-label="Breadcrumb">
      <BreadcrumbLink href="#">One</BreadcrumbLink>
      <BreadcrumbLink href="#">Two</BreadcrumbLink>
      <BreadcrumbLink href="#">Three</BreadcrumbLink>
      <BreadcrumbItem>Four</BreadcrumbItem>
    </Breadcrumb>

    <Code role="region" tabIndex="0">
      {`<Breadcrumb aria-label="Breadcrumb">
  <BreadcrumbLink href="/one">One</BreadcrumbLink>
  <BreadcrumbLink href="/two">Two</BreadcrumbLink>
  <BreadcrumbLink href="/three">Three</BreadcrumbLink>
  <BreadcrumbItem>Four</BreadcrumbItem>
</Breadcrumb>`}
    </Code>

    <h3>Custom Separators</h3>

    <Breadcrumb
      aria-label="Breadcrumb"
      separator={<Icon type="chevron-double-right" />}
    >
      <BreadcrumbLink href="#">One</BreadcrumbLink>
      <BreadcrumbLink href="#">Two</BreadcrumbLink>
      <BreadcrumbLink href="#">Three</BreadcrumbLink>
      <BreadcrumbItem>Four</BreadcrumbItem>
    </Breadcrumb>

    <Code role="region" tabIndex="0">
      {`<Breadcrumb aria-label="Breadcrumb" separator={<Icon type="chevron-double-right" />}>
  <BreadcrumbLink href="#">One</BreadcrumbLink>
  <BreadcrumbLink href="#">Two</BreadcrumbLink>
  <BreadcrumbLink href="#">Three</BreadcrumbLink>
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

export default BreadcrumbDemo;

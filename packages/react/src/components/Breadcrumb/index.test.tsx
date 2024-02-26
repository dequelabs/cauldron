import React from 'react';
import { render } from '@testing-library/react';
import Breadcrumb, { BreadcrumbLink, BreadcrumbItem } from './index';
import axe from '../../axe';

test('should render breadcrumbs', () => {
  const { container } = render(
    <Breadcrumb aria-label="breadcrumb">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );
  expect(container.querySelector('.Breadcrumb')).toBeInTheDocument();
  expect(container.querySelectorAll('li').length).toBe(3);
});

test('should render separators between breadcrumbs', () => {
  const { container } = render(
    <Breadcrumb aria-label="breadcrumb">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );
  const item = container.querySelector('Breadcrumb__Item');
  expect(container.querySelectorAll('.Breadcrumb__Separator').length).toBe(2);
  if (item) {
    const separator = item.querySelector('.Breadcrumb__Separator');
    expect(separator).not.toBeInTheDocument();
  }
});

test('should render custom separators between breadcrumbs', () => {
  const { container } = render(
    <Breadcrumb aria-label="breadcrumb" separator="💩">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );
  expect(container.textContent).toEqual('one💩two💩three');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <Breadcrumb aria-label="breadcrumb">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

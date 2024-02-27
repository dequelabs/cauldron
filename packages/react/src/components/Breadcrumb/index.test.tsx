import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumb, { BreadcrumbLink, BreadcrumbItem } from './';
import axe from '../../axe';

test('should render breadcrumbs', () => {
  render(
    <Breadcrumb aria-label="breadcrumb">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );
  expect(
    screen.getByRole('navigation', { name: 'breadcrumb' })
  ).toBeInTheDocument();
  expect(screen.queryAllByRole('listitem')).toHaveLength(3);
});

test('should render separators between breadcrumbs', () => {
  render(
    <Breadcrumb aria-label="breadcrumb">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );
  expect(
    screen.getByRole('navigation', { name: 'breadcrumb' })
  ).toHaveTextContent('one/two/three');
});

test('should render custom separators between breadcrumbs', () => {
  render(
    <Breadcrumb aria-label="breadcrumb" separator="💩">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );
  expect(
    screen.getByRole('navigation', { name: 'breadcrumb' })
  ).toHaveTextContent('one💩two💩three');
});

test('should return no axe violations', async () => {
  render(
    <Breadcrumb aria-label="breadcrumb">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );
  const results = await axe(
    screen.getByRole('navigation', { name: 'breadcrumb' })
  );
  expect(results).toHaveNoViolations();
});

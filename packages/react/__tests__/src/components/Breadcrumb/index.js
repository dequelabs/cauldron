import React, { createRef } from 'react';
import { shallow } from 'enzyme';
import {
  default as Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem
} from 'src/components/Breadcrumb';
import axe from '../../../axe';

test('should render breadcrumbs', () => {
  const breadcrumb = shallow(
    <Breadcrumb aria-label="breadcrumb">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );
  expect(breadcrumb.hasClass('Breadcrumb')).toBe(true);
  expect(breadcrumb.find('li').length).toBe(3);
});

test('should render separators between breadcrumbs', () => {
  const breadcrumb = shallow(
    <Breadcrumb aria-label="breadcrumb">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );
  expect(breadcrumb.find('.Breadcrumb__Separator').length).toBe(2);
  expect(
    breadcrumb
      .find(BreadcrumbItem)
      .find('.Breadcrumb__Separator')
      .exists()
  ).toBeFalsy();
});

test('should return no axe violations', async () => {
  const breadcrumb = shallow(
    <Breadcrumb aria-label="breadcrumb">
      <BreadcrumbLink href="#">one</BreadcrumbLink>
      <BreadcrumbLink href="#">two</BreadcrumbLink>
      <BreadcrumbItem>three</BreadcrumbItem>
    </Breadcrumb>
  );

  expect(await axe(breadcrumb.html())).toHaveNoViolations();
});

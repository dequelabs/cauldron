import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { BreadcrumbLink } from './';
import axe from '../../axe';

const CustomLinkComponent = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
): JSX.Element => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a data-testid="custom" {...props} />
);

test('should render breadcrumb link', () => {
  render(<BreadcrumbLink href="#">link</BreadcrumbLink>);
  expect(screen.getByRole('link', { name: 'link' })).toBeInTheDocument();
});

test('should support className prop', () => {
  render(
    <BreadcrumbLink className="banana" href="#">
      link
    </BreadcrumbLink>
  );
  expect(screen.getByRole('link')).toHaveClass(
    'Link',
    'Breadcrumb__Link',
    'banana'
  );
});

test('should support as prop', () => {
  render(
    <BreadcrumbLink href="#" as={CustomLinkComponent}>
      link
    </BreadcrumbLink>
  );
  expect(screen.getByTestId('custom')).toBeInTheDocument();
});

test('should support ref prop', () => {
  const anchorRef = createRef<HTMLAnchorElement>();
  render(
    <BreadcrumbLink href="#" ref={anchorRef}>
      link
    </BreadcrumbLink>
  );
  expect(anchorRef.current).toBeTruthy();
  expect(anchorRef.current).toEqual(screen.getByRole('link'));
});

test('should return no axe violations', async () => {
  render(<BreadcrumbLink href="#">link</BreadcrumbLink>);
  const results = await axe(screen.getByRole('link', { name: 'link' }));
  expect(results).toHaveNoViolations();
});

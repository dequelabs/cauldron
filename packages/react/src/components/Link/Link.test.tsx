import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import Link from './';
import axe from '../../axe';

test('should render link', () => {
  render(<Link href="https://acme.biz">Link</Link>);
  expect(screen.getByRole('link')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveTextContent('Link');
  expect(screen.getByRole('link')).toHaveClass('Link');
  expect(screen.getByRole('link')).toHaveAttribute('href', 'https://acme.biz');
});

test('should support variant="button"', () => {
  render(
    <Link href="https://acme.biz" variant="button">
      Link
    </Link>
  );
  expect(screen.getByRole('link')).toHaveClass('Button--primary');
});

test('should support variant="button-secondary"', () => {
  render(
    <Link href="https://acme.biz" variant="button-secondary">
      Link
    </Link>
  );
  expect(screen.getByRole('link')).toHaveClass('Button--secondary');
});

test('should support thin button', () => {
  render(
    <Link href="https://acme.biz" variant="button" thin>
      Link
    </Link>
  );
  expect(screen.getByRole('link')).toHaveClass('Button--thin');
});

test('should support className prop', () => {
  render(
    <Link href="https://acme.biz" className="bananas">
      Link
    </Link>
  );
  expect(screen.getByRole('link')).toHaveClass('Link', 'bananas');
});

test('should support ref prop', () => {
  const ref = createRef<HTMLAnchorElement>();
  render(
    <Link href="https://acme.biz" ref={ref}>
      Link
    </Link>
  );
  expect(ref.current).toBeTruthy();
  expect(ref.current).toEqual(screen.getByRole('link'));
});

test('should support linkRef prop', () => {
  const linkRef = createRef<HTMLAnchorElement>();
  render(
    <Link href="https://acme.biz" linkRef={linkRef}>
      Link
    </Link>
  );
  expect(linkRef.current).toBeTruthy();
  expect(linkRef.current).toEqual(screen.getByRole('link'));
});

test('should have no axe violations', async () => {
  render(<Link href="https://acme.biz">Link</Link>);
  const results = await axe(screen.getByRole('link'));
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with variant="button"', async () => {
  render(
    <Link href="https://acme.biz" variant="button" thin>
      Link
    </Link>
  );
  const results = await axe(screen.getByRole('link'));
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with variant="button-secondary"', async () => {
  render(
    <Link href="https://acme.biz" variant="button-secondary">
      Link
    </Link>
  );
  const results = await axe(screen.getByRole('link'));
  expect(results).toHaveNoViolations();
});

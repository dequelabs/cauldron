import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './';
import axe from '../../axe';

test('renders a Loader component', () => {
  render(<Loader data-testid="loader" />);
  expect(screen.getByTestId('loader')).toBeInTheDocument();
});

test('handles classNames properly', () => {
  render(<Loader data-testid="loader" className="baz" />);
  expect(screen.getByTestId('loader')).toHaveClass('Loader', 'baz');
});

test('sets aria-hidden if no label is provided', () => {
  render(<Loader data-testid="loader" />);
  expect(screen.getByTestId('loader')).toHaveAttribute('aria-hidden', 'true');
});

test('does not set aria-hidden if a label is provided', () => {
  render(<Loader data-testid="loader" label="hi" />);
  expect(screen.getByTestId('loader')).not.toHaveAttribute(
    'aria-hidden',
    'false'
  );
});

test('sets expected role attributes given an aria-label', () => {
  render(<Loader data-testid="loader" label="bananas" />);
  expect(screen.getByTestId('loader')).toHaveAttribute('role', 'alert');
});

test('supports ref={React.createRef()}', () => {
  const ref = React.createRef();
  render(<Loader ref={ref} />);
  expect(ref.current).toBeDefined();
});

test('returns no axe violations', async () => {
  const { container } = render(
    <>
      <Loader />
      <Loader label="hi" />
    </>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

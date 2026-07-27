import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import FieldError from './';

test('should render children', () => {
  render(<FieldError>Something went wrong</FieldError>);
  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});

test('should render as a polite live region so the message is announced', () => {
  render(<FieldError>Something went wrong</FieldError>);
  const error = screen.getByRole('alert');
  expect(error).toHaveTextContent('Something went wrong');
  expect(error).toHaveAttribute('aria-live', 'polite');
});

test('should render the caution icon by default', () => {
  const { container } = render(<FieldError>Something went wrong</FieldError>);
  expect(container.querySelector('.Icon--caution')).toBeInTheDocument();
});

test('should omit the caution icon when icon is false', () => {
  const { container } = render(
    <FieldError icon={false}>Something went wrong</FieldError>
  );
  expect(container.querySelector('.Icon--caution')).not.toBeInTheDocument();
});

test('should default to the shared field error class', () => {
  render(<FieldError>Something went wrong</FieldError>);
  expect(screen.getByRole('alert')).toHaveClass('Field__error');
});

test('should support overriding className', () => {
  render(<FieldError className="Error">Something went wrong</FieldError>);
  const error = screen.getByRole('alert');
  expect(error).toHaveClass('Error');
  expect(error).not.toHaveClass('Field__error');
});

test('should support ref prop', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(<FieldError ref={ref}>Something went wrong</FieldError>);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
});

test('should render FieldError with other props', () => {
  render(<FieldError id="banana">Something went wrong</FieldError>);
  expect(screen.getByRole('alert')).toHaveAttribute('id', 'banana');
});

test('should have no axe violations with FieldError', async () => {
  const { container } = render(<FieldError>Something went wrong</FieldError>);
  expect(await axe(container)).toHaveNoViolations();
});

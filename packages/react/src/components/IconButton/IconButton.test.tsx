import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import IconButton from './';

it('should render button', () => {
  render(<IconButton icon="pencil" label="Edit" />);
  const button = screen.getByRole('button', { name: 'Edit' });
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute('type', 'button');
  expect(button).toHaveAttribute('tabIndex', '0');
  expect(button).not.toHaveAttribute('role');
  expect(button).toHaveTextContent('');
});

it('should render a "as" an anchor', () => {
  render(<IconButton icon="pencil" label="Edit" as="a" href="/somewhere" />);
  const button = screen.queryByRole('link', { name: 'Edit' });
  expect(button).toBeInTheDocument();
  expect(button).not.toHaveAttribute('role');
});

it('should be disabled', () => {
  render(<IconButton icon="pencil" label="Edit" disabled />);
  expect(screen.queryByRole('button')).toBeDisabled();
});

it('should use aria-disabled for non-buttons when disabled', () => {
  render(
    // @ts-expect-error this technically should be allowed
    <IconButton icon="pencil" label="Edit" as="a" href="/somewhere" disabled />
  );
  expect(screen.queryByRole('link')).not.toBeDisabled();
  expect(screen.queryByRole('link')).toHaveAttribute('aria-disabled', 'true');
});

it('should add button role for custom components', () => {
  const CustomButton = React.forwardRef<HTMLDivElement>(function Component(
    props,
    ref
  ) {
    return <div data-testid="custom" ref={ref} {...props}></div>;
  });
  render(
    // @ts-expect-error this technically should be allowed
    <IconButton icon="pencil" label="Edit" as={CustomButton} />
  );
  expect(screen.getByTestId('custom')).toBeInTheDocument();
  expect(screen.getByTestId('custom')).toHaveAttribute('role', 'button');
  expect(screen.getByTestId('custom')).toHaveAttribute('tabIndex', '0');
});

it('should add link role when component behaves like a link', () => {
  const CustomLink = React.forwardRef<HTMLDivElement>(function Component(
    props,
    ref
  ) {
    return <div data-testid="custom" ref={ref} {...props}></div>;
  });
  render(
    // @ts-expect-error this technically should be allowed
    <IconButton icon="pencil" label="Edit" as={CustomLink} to="/testing" />
  );
  expect(screen.getByTestId('custom')).toBeInTheDocument();
  expect(screen.getByTestId('custom')).toHaveAttribute('role', 'link');
  expect(screen.getByTestId('custom')).toHaveAttribute('tabIndex', '0');
});

it('should not render tooltip when disabled prop is true', () => {
  render(<IconButton icon="pencil" label="Edit" disabled />);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).toHaveAttribute('tabIndex', '-1');
  expect(screen.queryByRole('button')).toHaveAccessibleName('Edit');
});

it('should support className prop', () => {
  render(<IconButton className="bananas" icon="pencil" label="Edit" />);
  expect(screen.queryByRole('button')).toHaveClass('IconButton', 'bananas');
});

it('should support ref prop', () => {
  const ref = createRef<HTMLButtonElement>();
  render(<IconButton icon="pencil" label="Edit" ref={ref} />);
  expect(ref.current).toBeTruthy();
  expect(ref.current).toEqual(screen.queryByRole('button'));
});

it('should support tooltipProps', () => {
  render(
    <>
      <div id="foo">custom name</div>
      <IconButton
        icon="pencil"
        label="Edit"
        tooltipProps={{ association: 'none' }}
        aria-labelledby="foo"
      />
    </>
  );
  expect(screen.queryByRole('button')).toHaveAccessibleName('custom name');
});

test('should return no axe violations', async () => {
  render(<IconButton icon="pencil" label="Edit" />);
  const results = await axe(screen.getByRole('button'));
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when rendered as anchor', async () => {
  render(
    // @ts-expect-error this technically should be allowed
    <IconButton icon="pencil" label="Edit" as="a" href="/somewhere" />
  );
  const results = await axe(screen.getByRole('link'));
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when rendered as CustomElement', async () => {
  const CustomButton = React.forwardRef<HTMLDivElement>(function Component(
    props,
    ref
  ) {
    return <div data-testid="custom" ref={ref} {...props}></div>;
  });
  render(
    <IconButton
      icon="pencil"
      label="Edit"
      // @ts-expect-error this technically should be allowed
      as={CustomButton}
      href="/somewhere"
    />
  );
  const results = await axe(screen.getByTestId('custom'));
  expect(results).toHaveNoViolations();
});

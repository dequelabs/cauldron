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

it('should render secondary variant', () => {
  render(<IconButton icon="pencil" label="Edit" variant="secondary" />);
  const button = screen.getByRole('button', { name: 'Edit' });
  expect(button).toHaveClass('IconButton--secondary');
});

it('should render primary variant', () => {
  render(<IconButton icon="pencil" label="Edit" variant="primary" />);
  const button = screen.getByRole('button', { name: 'Edit' });
  expect(button).toHaveClass('IconButton--primary');
});

it('should render tertiary variant', () => {
  render(<IconButton icon="pencil" label="Edit" variant="tertiary" />);
  const button = screen.getByRole('button', { name: 'Edit' });
  expect(button).toHaveClass('IconButton--tertiary');
});

it('should render error variant', () => {
  render(<IconButton icon="pencil" label="Edit" variant="error" />);
  const button = screen.getByRole('button', { name: 'Edit' });
  expect(button).toHaveClass('IconButton--error');
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
  render(<IconButton icon="pencil" label="Edit" as={CustomButton} />);
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
  // Note: this test is a bit obtuse since by default Tooltip overrides
  // aria-labelledby so we're testing the "none" association to ensure
  // we can set our own custom aria-label when necessary
  expect(screen.queryByRole('button')).toHaveAccessibleName('custom name');
});

test('should return no axe violations', async () => {
  render(<IconButton icon="pencil" label="Edit" />);
  const results = await axe(screen.getByRole('button'));
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when rendered as anchor', async () => {
  render(<IconButton icon="pencil" label="Edit" as="a" href="/somewhere" />);
  const button = await screen.findByRole('link');
  const results = await axe(button);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when rendered as CustomElement', async () => {
  const CustomButton = React.forwardRef<HTMLDivElement>(function Component(
    props,
    ref
  ) {
    return <div data-testid="custom" ref={ref} {...props}></div>;
  });

  render(<IconButton icon="pencil" label="Edit" as={CustomButton} />);
  const button = await screen.findByTestId('custom');
  const results = await axe(button);
  expect(results).toHaveNoViolations();
});

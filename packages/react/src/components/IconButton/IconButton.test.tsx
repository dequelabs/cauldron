import React, { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import IconButton from './';

test('should render button', async () => {
  render(<IconButton icon="pencil" label="Edit" />);
  const button = await screen.findByRole('button', { name: 'Edit' });
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute('type', 'button');
  expect(button).toHaveAttribute('tabIndex', '0');
  expect(button).not.toHaveAttribute('role');
  expect(button).toHaveTextContent('');
});

test('should render secondary variant', async () => {
  render(<IconButton icon="pencil" label="Edit" variant="secondary" />);
  const button = await screen.findByRole('button', { name: 'Edit' });
  expect(button).toHaveClass('IconButton--secondary');
});

test('should render primary variant', async () => {
  render(<IconButton icon="pencil" label="Edit" variant="primary" />);
  const button = await screen.findByRole('button', { name: 'Edit' });
  expect(button).toHaveClass('IconButton--primary');
});

test('should render tertiary variant', async () => {
  render(<IconButton icon="pencil" label="Edit" variant="tertiary" />);
  const button = await screen.findByRole('button', { name: 'Edit' });
  expect(button).toHaveClass('IconButton--tertiary');
});

test('should render error variant', async () => {
  render(<IconButton icon="pencil" label="Edit" variant="error" />);
  const button = await screen.findByRole('button', { name: 'Edit' });
  expect(button).toHaveClass('IconButton--error');
});

test('should render a "as" an anchor', async () => {
  render(<IconButton icon="pencil" label="Edit" as="a" href="/somewhere" />);
  const button = await screen.findByRole('link', { name: 'Edit' });
  expect(button).toBeInTheDocument();
  expect(button).not.toHaveAttribute('role');
});

test('should be disabled', async () => {
  render(<IconButton icon="pencil" label="Edit" disabled />);
  expect(await screen.findByRole('button')).toBeDisabled();
});

test('should use aria-disabled for non-buttons when disabled', async () => {
  render(
    <IconButton icon="pencil" label="Edit" as="a" href="/somewhere" disabled />
  );
  const link = await screen.findByRole('link');
  expect(link).not.toBeDisabled();
  expect(link).toHaveAttribute('aria-disabled', 'true');
});

test('should add button role for custom components', async () => {
  const CustomButton = React.forwardRef<HTMLDivElement>(function Component(
    props,
    ref
  ) {
    return <div data-testid="custom" ref={ref} {...props}></div>;
  });
  render(<IconButton icon="pencil" label="Edit" as={CustomButton} />);
  const custom = await screen.findByTestId('custom');
  expect(custom).toBeInTheDocument();
  expect(custom).toHaveAttribute('role', 'button');
  expect(custom).toHaveAttribute('tabIndex', '0');
});

test('should add link role when component behaves like a link', async () => {
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
  const custom = await screen.findByTestId('custom');
  expect(custom).toBeInTheDocument();
  expect(custom).toHaveAttribute('role', 'link');
  expect(custom).toHaveAttribute('tabIndex', '0');
});

test('should not render tooltip when disabled prop is true', () => {
  render(<IconButton icon="pencil" label="Edit" disabled />);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).toHaveAttribute('tabIndex', '-1');
  expect(screen.queryByRole('button')).toHaveAccessibleName('Edit');
});

test('should support className prop', async () => {
  render(<IconButton className="bananas" icon="pencil" label="Edit" />);
  expect(await screen.findByRole('button')).toHaveClass(
    'IconButton',
    'bananas'
  );
});

test('should support ref prop', async () => {
  const ref = createRef<HTMLButtonElement>();
  render(<IconButton icon="pencil" label="Edit" ref={ref} />);
  waitFor(() => {
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  expect(ref.current).toBeTruthy();
  expect(ref.current).toEqual(screen.queryByRole('button'));
});

test('should support tooltipProps', async () => {
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
  expect(await screen.findByRole('button')).toHaveAccessibleName('custom name');
});

test('should return no axe violations', async () => {
  render(<IconButton icon="pencil" label="Edit" />);
  const results = await axe(await screen.findByRole('button'));
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

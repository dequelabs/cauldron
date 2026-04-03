import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import Switch from './';

describe('Switch', () => {
  test('renders with label', () => {
    render(<Switch id="test" label="Toggle me" />);
    expect(screen.getByLabelText('Toggle me')).toBeInTheDocument();
  });

  test('is unchecked by default', () => {
    render(<Switch id="test" label="Toggle" />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  test('renders checked state', () => {
    render(<Switch id="test" label="Toggle" checked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  test('renders disabled state', () => {
    render(<Switch id="test" label="Toggle" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  test('renders disabled checked state', () => {
    render(<Switch id="test" label="Toggle" disabled checked />);
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  test('passes className to wrapper div', () => {
    const { container } = render(
      <Switch id="test" label="Toggle" className="custom-class" />
    );
    expect(container.querySelector('.Switch.custom-class')).toBeInTheDocument();
  });

  test('calls onChange when toggled', () => {
    const onChange = jest.fn();
    render(<Switch id="test" label="Toggle" onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('does not call onChange when disabled', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<Switch id="test" label="Toggle" disabled onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('calls onFocus when focused', () => {
    const onFocus = jest.fn();
    render(<Switch id="test" label="Toggle" onFocus={onFocus} />);
    fireEvent.focus(screen.getByRole('switch'));
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  test('calls onBlur when blurred', () => {
    const onBlur = jest.fn();
    render(<Switch id="test" label="Toggle" onBlur={onBlur} />);
    fireEvent.blur(screen.getByRole('switch'));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('syncs with controlled checked prop', () => {
    const { rerender } = render(
      <Switch id="test" label="Toggle" checked={false} onChange={jest.fn()} />
    );
    expect(screen.getByRole('switch')).not.toBeChecked();
    rerender(
      <Switch id="test" label="Toggle" checked={true} onChange={jest.fn()} />
    );
    expect(screen.getByRole('switch')).toBeChecked();
  });

  test('renders error message', () => {
    render(<Switch id="test" label="Toggle" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('renders label description', () => {
    render(
      <Switch id="test" label="Toggle" labelDescription="Additional info" />
    );
    expect(screen.getByText('Additional info')).toBeInTheDocument();
  });

  test('associates error with input via aria-describedby', () => {
    render(<Switch id="test" label="Toggle" error="Error message" />);
    const input = screen.getByRole('switch');
    const errorEl = screen.getByText('Error message');
    expect(input.getAttribute('aria-describedby')).toContain(errorEl.id);
  });

  test('associates label description with input via aria-describedby', () => {
    render(
      <Switch id="test" label="Toggle" labelDescription="Description text" />
    );
    const input = screen.getByRole('switch');
    const descEl = screen.getByText('Description text');
    expect(input.getAttribute('aria-describedby')).toContain(descEl.id);
  });

  test('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Switch id="test" label="Toggle" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('has role switch', () => {
    render(<Switch id="test" label="Toggle" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  test('should have no axe violations when unchecked', async () => {
    const { container } = render(<Switch id="test" label="Toggle" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have no axe violations when checked', async () => {
    const { container } = render(
      <Switch id="test" label="Toggle" checked onChange={jest.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have no axe violations when disabled', async () => {
    const { container } = render(<Switch id="test" label="Toggle" disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have no axe violations when disabled and checked', async () => {
    const { container } = render(
      <Switch id="test" label="Toggle" disabled checked onChange={jest.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have no axe violations with error', async () => {
    const { container } = render(
      <Switch id="test" label="Toggle" error="This field is required" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have no axe violations with label description', async () => {
    const { container } = render(
      <Switch id="test" label="Toggle" labelDescription="Additional info" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

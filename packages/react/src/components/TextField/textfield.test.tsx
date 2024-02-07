import React, { createRef } from 'react';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { spy } from 'sinon';
import { axe } from 'jest-axe';
import TextField from './';

type SetOptional<T, Keys extends keyof T> = Pick<Partial<T>, Keys> &
  Omit<T, Keys>;
type TextFieldProps = SetOptional<
  React.ComponentProps<typeof TextField>,
  'label'
>;

const renderTextField = ({
  label,
  ...props
}: TextFieldProps = {}): HTMLInputElement => {
  render(<TextField label={label || 'text field'} {...props} />);
  // no individual assertions needed, as this should throw if the element does not exist
  return screen.getByRole('textbox', { name: label as string });
};

test('should render textfield', () => {
  const input = renderTextField();
  expect(input).toHaveValue('');
  expect(input).toHaveDisplayValue('');
  expect(input.tagName).toBe('INPUT');
});

test('should render textfield with default value', () => {
  const input = renderTextField({ defaultValue: 'input value' });
  expect(input).toHaveValue('input value');
  expect(input).toHaveDisplayValue('input value');
});

test('should render textfield with controlled value', () => {
  const input = renderTextField({ value: 'input value' });
  expect(input).toHaveValue('input value');
  expect(input).toHaveDisplayValue('input value');
});

test('should render required textfield', () => {
  const input = renderTextField({ required: true });
  expect(input).toBeRequired();
});

test('should render disabled textfield', () => {
  const input = renderTextField({ disabled: true });
  expect(input).toBeDisabled();
});

test('should render error textfield', () => {
  const input = renderTextField({ error: 'there is an error with this field' });
  expect(input).toHaveAccessibleDescription(
    'there is an error with this field'
  );
  expect(
    screen.queryByText('there is an error with this field')
  ).toBeInTheDocument();
});

test('should render multiline textfield', () => {
  const input = renderTextField({ multiline: true });
  expect(input).toHaveValue('');
  expect(input).toHaveDisplayValue('');
  expect(input.tagName).toBe('TEXTAREA');
});

test('should render multiline textfield with default value', () => {
  const input = renderTextField({
    multiline: true,
    defaultValue: 'textarea value'
  });
  expect(input).toHaveValue('textarea value');
  expect(input).toHaveDisplayValue('textarea value');
});

test('should render multiline textfield with controlled value', () => {
  const input = renderTextField({ multiline: true, value: 'textarea value' });
  expect(input).toHaveValue('textarea value');
  expect(input).toHaveDisplayValue('textarea value');
});

test('should render multiline required textfield', () => {
  const input = renderTextField({ multiline: true, required: true });
  expect(input).toBeRequired();
});

test('should render multiline disabled textfield', () => {
  const input = renderTextField({ multiline: true, disabled: true });
  expect(input).toBeDisabled();
});

test('should render multiline error textfield', () => {
  const input = renderTextField({
    multiline: true,
    error: 'there is an error with this field'
  });
  expect(input).toHaveAccessibleDescription(
    'there is an error with this field'
  );
  expect(
    screen.queryByText('there is an error with this field')
  ).toBeInTheDocument();
});

test('should support fieldRef prop', () => {
  const ref = createRef<HTMLInputElement>();
  render(<TextField label="text field" fieldRef={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLInputElement);
  expect(ref.current).toEqual(
    screen.queryByRole('textbox', { name: 'text field' })
  );
});

test('should support className prop', () => {
  render(<TextField label="text field" className="banana" />);
  expect(screen.queryByRole('textbox', { name: 'text field' })).toHaveClass(
    'Field__text-input',
    'banana'
  );
});

test('should have no axe violations with textfield', async () => {
  const input = renderTextField();
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with multiline textfield', async () => {
  const input = renderTextField({ multiline: true });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with required textfield', async () => {
  const input = renderTextField({ required: true });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with required multiline textfield', async () => {
  const input = renderTextField({ multiline: true, required: true });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when textfield has errors', async () => {
  const input = renderTextField({ error: 'this field has an error' });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when multiline textfield has errors', async () => {
  const input = renderTextField({
    error: 'this field has an error',
    multiline: true
  });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

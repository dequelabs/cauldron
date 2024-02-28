import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spy } from 'sinon';
import { axe } from 'jest-axe';
import SearchField from '.';

type SetOptional<T, Keys extends keyof T> = Pick<Partial<T>, Keys> &
  Omit<T, Keys>;
type SearchFieldProps = SetOptional<
  React.ComponentProps<typeof SearchField>,
  'label'
>;

const renderSearchField = ({
  label,
  ...props
}: SearchFieldProps = {}): HTMLInputElement => {
  render(<SearchField label={label || 'text field'} {...props} />);
  // no individual assertions needed, as this should throw if the element does not exist
  return screen.getByRole('textbox', {
    name: label as string
  }) as HTMLInputElement;
};

test('should render SearchField', () => {
  const input = renderSearchField({ label: 'this is a text field' });
  expect(input).toHaveValue('');
  expect(input).toHaveDisplayValue('');
  expect(input.tagName).toBe('INPUT');
  expect(screen.queryByText('this is a text field')).toBeInTheDocument();
});

test('should render SearchField with default value', () => {
  const input = renderSearchField({ defaultValue: 'input value' });
  expect(input).toHaveValue('input value');
  expect(input).toHaveDisplayValue('input value');
});

test('should render SearchField with controlled value', () => {
  const input = renderSearchField({ value: 'input value' });
  expect(input).toHaveValue('input value');
  expect(input).toHaveDisplayValue('input value');
});

test('should render required SearchField', () => {
  const input = renderSearchField({ required: true });
  expect(input).toBeRequired();
});

test('should render disabled SearchField', () => {
  const input = renderSearchField({ disabled: true });
  expect(input).toBeDisabled();
});

test('should render error SearchField', () => {
  const input = renderSearchField({
    error: 'there is an error with this field'
  });
  expect(input).toHaveAccessibleDescription(
    'there is an error with this field'
  );
  expect(
    screen.queryByText('there is an error with this field')
  ).toBeInTheDocument();
});

test('should render multiline SearchField', () => {
  const input = renderSearchField({
    label: 'this is a textarea field',
    multiline: true
  });
  expect(input).toHaveValue('');
  expect(input).toHaveDisplayValue('');
  expect(input.tagName).toBe('TEXTAREA');
  expect(screen.queryByText('this is a textarea field')).toBeInTheDocument();
});

test('should render multiline SearchField with default value', () => {
  const input = renderSearchField({
    multiline: true,
    defaultValue: 'textarea value'
  });
  expect(input).toHaveValue('textarea value');
  expect(input).toHaveDisplayValue('textarea value');
});

test('should render multiline SearchField with controlled value', () => {
  const input = renderSearchField({ multiline: true, value: 'textarea value' });
  expect(input).toHaveValue('textarea value');
  expect(input).toHaveDisplayValue('textarea value');
});

test('should render multiline required SearchField', () => {
  const input = renderSearchField({ multiline: true, required: true });
  expect(input).toBeRequired();
});

test('should render multiline disabled SearchField', () => {
  const input = renderSearchField({ multiline: true, disabled: true });
  expect(input).toBeDisabled();
});

test('should render multiline error SearchField', () => {
  const input = renderSearchField({
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
  render(<SearchField label="text field" fieldRef={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLInputElement);
  expect(ref.current).toEqual(
    screen.queryByRole('textbox', { name: 'text field' })
  );
});

test('should support className prop', () => {
  render(<SearchField label="text field" className="banana" />);
  expect(screen.queryByRole('textbox', { name: 'text field' })).toHaveClass(
    'Field__text-input',
    'banana'
  );
});

test('should support name prop', () => {
  render(
    <form data-testid="form">
      <SearchField label="text field" name="text" value="bananas" />
    </form>
  );
  const form = screen.getByTestId('form');
  expect(form).toHaveFormValues({
    text: 'bananas'
  });
});

test('should support name prop with multiline', () => {
  render(
    <form data-testid="form">
      <SearchField label="text field" name="text" value="bananas" multiline />
    </form>
  );
  const form = screen.getByTestId('form');
  expect(form).toHaveFormValues({
    text: 'bananas'
  });
});

test('should update input value when uncontrolled', async () => {
  const user = userEvent.setup();
  const input = renderSearchField();

  await user.type(input, 'hello world');
  expect(input).toHaveValue('hello world');
  expect(input).toHaveDisplayValue('hello world');
});

test('should not update input value when controlled', async () => {
  const user = userEvent.setup();
  const input = renderSearchField({ value: 'bananas' });

  await user.type(input, 'hello world');
  expect(input).toHaveValue('bananas');
  expect(input).toHaveDisplayValue('bananas');
});

test('should update multiline input value when uncontrolled', async () => {
  const user = userEvent.setup();
  const input = renderSearchField({ multiline: true });

  await user.type(input, 'hello world');
  expect(input).toHaveValue('hello world');
  expect(input).toHaveDisplayValue('hello world');
});

test('should not update multiline input value when controlled', async () => {
  const user = userEvent.setup();
  const input = renderSearchField({ value: 'bananas', multiline: true });

  await user.type(input, 'hello world');
  expect(input).toHaveValue('bananas');
  expect(input).toHaveDisplayValue('bananas');
});

test('should call onChange with input', async () => {
  const user = userEvent.setup();
  const onChange = spy();
  const input = renderSearchField({ onChange });

  expect(onChange.notCalled).toBeTruthy();
  await user.type(input, 'hello world');
  expect(onChange.callCount).toEqual('hello world'.length);
  expect(onChange.lastCall.firstArg).toEqual('hello world');
});

test('should call onChange with multiline input', async () => {
  const user = userEvent.setup();
  const onChange = spy();
  const input = renderSearchField({ onChange, multiline: true });

  expect(onChange.notCalled).toBeTruthy();
  await user.type(input, 'hello world');
  expect(onChange.callCount).toEqual('hello world'.length);
  expect(onChange.lastCall.firstArg).toEqual('hello world');
});

test('should have no axe violations with SearchField', async () => {
  const input = renderSearchField();
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with multiline SearchField', async () => {
  const input = renderSearchField({ multiline: true });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with required SearchField', async () => {
  const input = renderSearchField({ required: true });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with required multiline SearchField', async () => {
  const input = renderSearchField({ multiline: true, required: true });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when SearchField has errors', async () => {
  const input = renderSearchField({ error: 'this field has an error' });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when multiline SearchField has errors', async () => {
  const input = renderSearchField({
    error: 'this field has an error',
    multiline: true
  });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

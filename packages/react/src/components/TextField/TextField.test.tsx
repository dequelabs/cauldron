import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  return screen.getByRole('textbox', {
    name: label as string
  }) as HTMLInputElement;
};

test('should render textfield', () => {
  const input = renderTextField({ label: 'this is a text field' });
  expect(input).toHaveValue('');
  expect(input).toHaveDisplayValue('');
  expect(input.tagName).toBe('INPUT');
  expect(screen.queryByText('this is a text field')).toBeInTheDocument();
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

test('should render textfield with description', () => {
  const description = 'this is a description for the field';
  const input = renderTextField({
    description
  });
  expect(input).toHaveAccessibleDescription(description);
  expect(screen.queryByText(description)).toBeInTheDocument();
});

test('should render multiline textfield', () => {
  const input = renderTextField({
    label: 'this is a textarea field',
    multiline: true
  });
  expect(input).toHaveValue('');
  expect(input).toHaveDisplayValue('');
  expect(input.tagName).toBe('TEXTAREA');
  expect(screen.queryByText('this is a textarea field')).toBeInTheDocument();
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

test('should support name prop', () => {
  render(
    <form data-testid="form">
      <TextField label="text field" name="text" value="bananas" />
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
      <TextField label="text field" name="text" value="bananas" multiline />
    </form>
  );
  const form = screen.getByTestId('form');
  expect(form).toHaveFormValues({
    text: 'bananas'
  });
});

test('should update input value when uncontrolled', async () => {
  const user = userEvent.setup();
  const input = renderTextField();

  await user.type(input, 'hello world');
  expect(input).toHaveValue('hello world');
  expect(input).toHaveDisplayValue('hello world');
});

test('should not update input value when controlled', async () => {
  const user = userEvent.setup();
  const input = renderTextField({ value: 'bananas' });

  await user.type(input, 'hello world');
  expect(input).toHaveValue('bananas');
  expect(input).toHaveDisplayValue('bananas');
});

test('should update multiline input value when uncontrolled', async () => {
  const user = userEvent.setup();
  const input = renderTextField({ multiline: true });

  await user.type(input, 'hello world');
  expect(input).toHaveValue('hello world');
  expect(input).toHaveDisplayValue('hello world');
});

test('should not update multiline input value when controlled', async () => {
  const user = userEvent.setup();
  const input = renderTextField({ value: 'bananas', multiline: true });

  await user.type(input, 'hello world');
  expect(input).toHaveValue('bananas');
  expect(input).toHaveDisplayValue('bananas');
});

test('should call onChange with input', async () => {
  const user = userEvent.setup();
  const onChange = spy();
  const input = renderTextField({ onChange });

  expect(onChange.notCalled).toBeTruthy();
  await user.type(input, 'hello world');
  expect(onChange.callCount).toEqual('hello world'.length);
  expect(onChange.lastCall.firstArg).toEqual('hello world');
});

test('should call onChange with multiline input', async () => {
  const user = userEvent.setup();
  const onChange = spy();
  const input = renderTextField({ onChange, multiline: true });

  expect(onChange.notCalled).toBeTruthy();
  await user.type(input, 'hello world');
  expect(onChange.callCount).toEqual('hello world'.length);
  expect(onChange.lastCall.firstArg).toEqual('hello world');
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

test('should have no axe violations when textfield has description', async () => {
  const input = renderTextField({
    description: 'this field has a description'
  });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should support forwarded ref', () => {
  const ref = createRef<HTMLInputElement | HTMLTextAreaElement>();
  render(<TextField label="text field" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLInputElement);
  expect(ref.current).toEqual(
    screen.queryByRole('textbox', { name: 'text field' })
  );
});

test('should support forwarded ref with multiline', () => {
  const ref = createRef<HTMLInputElement | HTMLTextAreaElement>();
  render(<TextField label="text field" ref={ref} multiline />);
  expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
});

test('should support fieldRef prop with multiline', () => {
  const ref = createRef<HTMLInputElement | HTMLTextAreaElement>();
  render(<TextField label="text field" fieldRef={ref} multiline />);
  expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
});

test('should support both forwarded ref and fieldRef', () => {
  const ref = createRef<HTMLInputElement | HTMLTextAreaElement>();
  const fieldRef = createRef<HTMLInputElement | HTMLTextAreaElement>();
  render(<TextField label="text field" ref={ref} fieldRef={fieldRef} />);
  const input = screen.getByRole('textbox', { name: 'text field' });
  expect(ref.current).toBe(input);
  expect(fieldRef.current).toBe(input);
});

test('should use provided id for the field', () => {
  const input = renderTextField({ id: 'my-field' });
  expect(input).toHaveAttribute('id', 'my-field');
  expect(screen.getByText('text field').closest('label')).toHaveAttribute(
    'for',
    'my-field'
  );
});

test('should generate unique field ids when id is not provided', () => {
  render(
    <>
      <TextField label="first" />
      <TextField label="second" />
    </>
  );
  const first = screen.getByRole('textbox', { name: 'first' });
  const second = screen.getByRole('textbox', { name: 'second' });
  expect(first.id).toBeTruthy();
  expect(second.id).toBeTruthy();
  expect(first.id).not.toEqual(second.id);
});

test('should render textfield with both description and error', () => {
  const input = renderTextField({
    description: 'the description',
    error: 'the error'
  });
  expect(input).toHaveAccessibleDescription('the description the error');
});

test('should merge provided aria-describedby with description and error', () => {
  render(
    <>
      <div id="custom">custom</div>
      <TextField
        label="text field"
        aria-describedby="custom"
        description="the description"
        error="the error"
      />
    </>
  );
  const input = screen.getByRole('textbox', { name: 'text field' });
  const descriptionId = screen.getByText('the description').id;
  const errorId = screen.getByText('the error').closest('.Field__error')?.id;
  expect(input).toHaveAttribute(
    'aria-describedby',
    `custom ${descriptionId} ${errorId}`
  );
  expect(input).toHaveAccessibleDescription('custom the description the error');
});

test('should keep provided aria-describedby without description or error', () => {
  const input = renderTextField({ 'aria-describedby': 'custom' });
  expect(input).toHaveAttribute('aria-describedby', 'custom');
});

test('should set aria-invalid based on error', () => {
  const { rerender } = render(<TextField label="text field" />);
  const input = screen.getByRole('textbox', { name: 'text field' });
  expect(input).toHaveAttribute('aria-invalid', 'false');
  expect(input).not.toHaveClass('Field--has-error');

  rerender(<TextField label="text field" error="the error" />);
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveClass('Field--has-error');
});

test('should render required text hidden from assistive technology', () => {
  renderTextField({ required: true });
  const requiredText = screen.getByText('Required');
  expect(requiredText).toHaveAttribute('aria-hidden', 'true');
});

test('should support custom requiredText', () => {
  renderTextField({ required: true, requiredText: 'Mandatory' });
  expect(screen.getByText('Mandatory')).toBeInTheDocument();
  expect(screen.queryByText('Required')).not.toBeInTheDocument();
});

test('should not render required text when not required', () => {
  renderTextField();
  expect(screen.queryByText('Required')).not.toBeInTheDocument();
});

test('should call onChange with the change event', async () => {
  const user = userEvent.setup();
  const onChange = spy();
  const input = renderTextField({ onChange });

  await user.type(input, 'a');
  expect(onChange.calledOnce).toBeTruthy();
  expect(onChange.firstCall.args[0]).toEqual('a');
  expect(onChange.firstCall.args[1].target).toBe(input);
});

test('should call onChange when controlled', async () => {
  const user = userEvent.setup();
  const onChange = spy();
  const input = renderTextField({ onChange, value: 'bananas' });

  await user.type(input, 'a');
  expect(onChange.calledOnce).toBeTruthy();
  expect(onChange.firstCall.args[0]).toEqual('bananasa');
});

test('should update controlled value when value prop changes', () => {
  const { rerender } = render(<TextField label="text field" value="one" />);
  const input = screen.getByRole('textbox', { name: 'text field' });
  expect(input).toHaveValue('one');

  rerender(<TextField label="text field" value="two" />);
  expect(input).toHaveValue('two');
});

test('should not update uncontrolled value when defaultValue changes', () => {
  const { rerender } = render(
    <TextField label="text field" defaultValue="one" />
  );
  const input = screen.getByRole('textbox', { name: 'text field' });
  expect(input).toHaveValue('one');

  rerender(<TextField label="text field" defaultValue="two" />);
  expect(input).toHaveValue('one');
});

test('should not pass defaultValue through to the field', () => {
  const input = renderTextField({ defaultValue: 'one' });
  expect(input).not.toHaveAttribute('defaultvalue');
});

test('should pass through additional props to the field', () => {
  const input = renderTextField({
    placeholder: 'type here',
    maxLength: 10,
    // @ts-expect-error data attributes are not part of the props type
    'data-testid': 'the-field'
  });
  expect(input).toHaveAttribute('placeholder', 'type here');
  expect(input).toHaveAttribute('maxlength', '10');
  expect(input).toHaveAttribute('data-testid', 'the-field');
});

test('should derive description and error ids from provided id', () => {
  const input = renderTextField({
    id: 'my-field',
    description: 'the description',
    error: 'the error'
  });
  expect(screen.getByText('the description')).toHaveAttribute(
    'id',
    'my-field-description'
  );
  expect(
    screen.getByText('the error').closest('.Field__error')
  ).toHaveAttribute('id', 'my-field-error');
  expect(input).toHaveAttribute(
    'aria-describedby',
    'my-field-description my-field-error'
  );
});

test('should keep description and error ids stable across renders', () => {
  const props = {
    label: 'text field',
    id: 'my-field',
    description: 'the description',
    error: 'the error'
  };
  const { unmount } = render(<TextField {...props} />);
  const firstDescribedby = screen
    .getByRole('textbox', { name: 'text field' })
    .getAttribute('aria-describedby');
  unmount();

  render(<TextField {...props} />);
  expect(screen.getByRole('textbox', { name: 'text field' })).toHaveAttribute(
    'aria-describedby',
    firstDescribedby
  );
});

test('should derive description and error ids from generated id', () => {
  const input = renderTextField({
    description: 'the description',
    error: 'the error'
  });
  expect(input.id).toBeTruthy();
  expect(screen.getByText('the description')).toHaveAttribute(
    'id',
    `${input.id}-description`
  );
  expect(
    screen.getByText('the error').closest('.Field__error')
  ).toHaveAttribute('id', `${input.id}-error`);
});

test('should not collide description and error ids between text fields', () => {
  render(
    <>
      <TextField label="first" description="first description" error="err" />
      <TextField label="second" description="second description" error="err" />
    </>
  );
  expect(
    screen.getByRole('textbox', { name: 'first' })
  ).toHaveAccessibleDescription('first description err');
  expect(
    screen.getByRole('textbox', { name: 'second' })
  ).toHaveAccessibleDescription('second description err');
  expect(screen.getByText('first description').id).not.toEqual(
    screen.getByText('second description').id
  );
});

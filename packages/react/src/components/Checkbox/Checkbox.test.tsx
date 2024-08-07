import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spy } from 'sinon';
import { axe } from 'jest-axe';
import Checkbox from './';

type SetOptional<T, Keys extends keyof T> = Pick<Partial<T>, Keys> &
  Omit<T, Keys>;
type CheckboxProps = SetOptional<
  React.ComponentProps<typeof Checkbox>,
  'label' | 'id'
>;

const renderCheckbox = ({
  label,
  ...props
}: CheckboxProps = {}): HTMLInputElement => {
  render(<Checkbox id="checkbox-id" label={label || 'checkbox'} {...props} />);
  // no individual assertions needed, as this should throw if the element does not exist
  return screen.getByRole('checkbox', {
    name: label as string
  }) as HTMLInputElement;
};

test('should render unchecked checkbox', () => {
  const input = renderCheckbox({ label: 'this is a checkbox' });
  expect(input).not.toBeChecked();
  expect(screen.queryByText('this is a checkbox')).toBeInTheDocument();
});

test('should render checked checkbox', () => {
  const input = renderCheckbox({ checked: true });
  expect(input).toBeChecked();
});

test('should render disabled unchecked checkbox', () => {
  const input = renderCheckbox({ disabled: true });
  expect(input).toBeDisabled();
  expect(input).not.toBeChecked();
});

test('should render disabled checked checkbox', () => {
  const input = renderCheckbox({ disabled: true, checked: true });
  expect(input).toBeDisabled();
  expect(input).toBeChecked();
});

test('should render indeterminate checkbox', () => {
  const ref = createRef<HTMLInputElement>();
  render(<Checkbox id="id" label="checkbox" ref={ref} indeterminate />);
  expect(ref.current).toBeInstanceOf(HTMLInputElement);
  expect(ref.current?.indeterminate).toBeTruthy();
  expect(ref.current).toEqual(
    screen.queryByRole('checkbox', { name: 'checkbox' })
  );
});

test('should render disabled indeterminate checkbox', () => {
  const ref = createRef<HTMLInputElement>();
  render(
    <Checkbox id="id" label="checkbox" ref={ref} disabled indeterminate />
  );
  expect(ref.current).toBeInstanceOf(HTMLInputElement);
  expect(ref.current?.indeterminate).toBeTruthy();
  expect(ref.current).toBeDisabled();
  expect(ref.current).toEqual(
    screen.queryByRole('checkbox', { name: 'checkbox' })
  );
});

test('should render error checkbox', () => {
  const input = renderCheckbox({ error: 'you should check this checkbox' });
  expect(input).toHaveAccessibleDescription('you should check this checkbox');
  expect(
    screen.queryByText('you should check this checkbox')
  ).toBeInTheDocument();
});

test('should toggle checkbox correctly', async () => {
  const user = userEvent.setup();
  const input = renderCheckbox();
  const checkboxIcon = input.parentElement!.querySelector(
    '.Checkbox__overlay'
  ) as HTMLElement;
  expect(checkboxIcon).toHaveClass('Icon--checkbox-unchecked');
  expect(checkboxIcon).not.toHaveClass('Icon--checkbox-checked');
  expect(input).not.toBeChecked();

  await user.click(checkboxIcon);
  expect(checkboxIcon).not.toHaveClass('Icon--checkbox-unchecked');
  expect(checkboxIcon).toHaveClass('Icon--checkbox-checked');
});

test('should handle focus correctly', () => {
  const onFocus = spy();
  const input = renderCheckbox({ onFocus });
  const checkboxIcon = input.parentElement!.querySelector(
    '.Checkbox__overlay'
  ) as HTMLElement;
  expect(checkboxIcon).not.toHaveClass('.Checkbox__overlay--focused');
  expect(onFocus.notCalled).toBeTruthy();

  input.focus();
  expect(input).toHaveFocus();
  expect(checkboxIcon).toHaveClass('Checkbox__overlay--focused');
  expect(onFocus.calledOnce).toBeTruthy();
});

test('should handle blur correctly', () => {
  const onBlur = spy();
  const input = renderCheckbox({ onBlur, checked: true });
  const checkboxIcon = input.parentElement!.querySelector(
    '.Checkbox__overlay'
  ) as HTMLElement;
  expect(checkboxIcon).not.toHaveClass('.Checkbox__overlay--focused');
  expect(onBlur.notCalled).toBeTruthy();

  input.focus();
  input.blur();
  expect(input).not.toHaveFocus();
  expect(checkboxIcon).not.toHaveClass('Checkbox__overlay--focused');
  expect(onBlur.calledOnce).toBeTruthy();
});

test('should handle onChange correctly', async () => {
  const user = userEvent.setup();
  const onChange = spy();
  const input = renderCheckbox({ onChange });

  expect(onChange.notCalled).toBeTruthy();
  await user.click(input);
  expect(onChange.calledOnce).toBeTruthy();
});

test('should support ref prop', () => {
  const ref = createRef<HTMLInputElement>();
  render(<Checkbox id="id" label="checkbox" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLInputElement);
  expect(ref.current).toEqual(
    screen.queryByRole('checkbox', { name: 'checkbox' })
  );
});

test('should support checkboxRef prop', () => {
  const ref = createRef<HTMLInputElement>();
  render(<Checkbox id="id" label="checkbox" checkboxRef={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLInputElement);
  expect(ref.current).toEqual(
    screen.queryByRole('checkbox', { name: 'checkbox' })
  );
});

test('should support className prop', () => {
  const input = renderCheckbox({ className: 'banana' });
  expect(input.parentElement).toHaveClass('Checkbox', 'banana');
});

test('should support value prop', () => {
  render(
    <form data-testid="form">
      <Checkbox id="id-1" name="checkbox" label="checkbox" value="apples" />
      <Checkbox
        id="id-2"
        name="checkbox"
        label="checkbox"
        value="bananas"
        checked
      />
    </form>
  );
  const form = screen.getByTestId('form');
  expect(form).toHaveFormValues({ checkbox: ['bananas'] });
});

test('should support labelDescription prop', () => {
  const input = renderCheckbox({
    labelDescription: 'more stuff and things you should know'
  });
  expect(input).toHaveAccessibleDescription(
    /more stuff and things you should know/
  );
  expect(
    screen.queryByText('more stuff and things you should know')
  ).toBeInTheDocument();
});

test('should have no axe violations with unchecked checkbox', async () => {
  const input = renderCheckbox();
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with checked checkbox', async () => {
  const input = renderCheckbox({ checked: true });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with disabled checkbox', async () => {
  const input = renderCheckbox({ disabled: true });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when checkbox has errors', async () => {
  const input = renderCheckbox({ error: 'you should check this checkbox' });
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

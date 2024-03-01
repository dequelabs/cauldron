import React, { createRef, ComponentProps } from 'react';
import { render as testingRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spy } from 'sinon';
import { axe } from 'jest-axe';

import SearchField from './';

type SetOptional<T, Keys extends keyof T> = Pick<Partial<T>, Keys> &
  Omit<T, Keys>;

type SearchFieldProps = SetOptional<
  ComponentProps<typeof SearchField>,
  'label'
>;

const defaultProps = {
  label: 'search field',
  ref: undefined
};

const render = ({
  label,
  ref,
  ...props
}: SearchFieldProps = defaultProps): HTMLInputElement => {
  testingRender(
    <SearchField ref={ref} label={label || 'search field'} {...props} />
  );
  // no individual assertions needed, as this should throw if the element does not exist
  return screen.getByRole('searchbox', {
    name: label as string
  }) as HTMLInputElement;
};

test('should render SearchField', () => {
  const input = render();
  expect(input).toHaveValue('');
  expect(input).toHaveDisplayValue('');
  expect(input.tagName).toBe('INPUT');
  expect(screen.getByText('search field')).toBeInTheDocument();
  expect(input).toHaveAttribute('type', 'search');
});

test('should render visible label when hideLabel is false (default)', () => {
  render();
  expect(screen.getByText('search field').parentElement).not.toHaveClass(
    'Offscreen'
  );
});

test('should render hidden label when hideLabel is true', () => {
  render({ hideLabel: true });
  // the parent of the element with text "search field" should have the class "Offscreen"
  expect(screen.getByText('search field').parentElement).toHaveClass(
    'Offscreen'
  );
});

test('should render input with default placeholder text when no placeholder is provided', () => {
  const input = render();
  expect(input).toHaveAttribute('placeholder', 'Search...');
});

test('should render input with placeholder when placeholder is provided', () => {
  const input = render({ placeholder: 'Search for something' });
  expect(input).toHaveAttribute('placeholder', 'Search for something');
});

test('should render input in form element with role "search" when isForm is true (default)', () => {
  render();
  expect(screen.getByRole('search')).toBeInTheDocument();
});

test('should render input in div element when isForm is false', () => {
  render({ isForm: false });
  expect(screen.queryByRole('search')).not.toBeInTheDocument();
});

test('should render SearchField with default value', () => {
  const input = render({ defaultValue: 'input value' });
  expect(input).toHaveValue('input value');
  expect(input).toHaveDisplayValue('input value');
});

test('should render SearchField with controlled value', () => {
  const input = render({ value: 'input value' });
  expect(input).toHaveValue('input value');
  expect(input).toHaveDisplayValue('input value');
});

test('should update input value when uncontrolled', async () => {
  const user = userEvent.setup();
  const input = render();

  await user.type(input, 'hello world');
  expect(input).toHaveValue('hello world');
  expect(input).toHaveDisplayValue('hello world');
});

test('should not update input value when controlled', async () => {
  const user = userEvent.setup();
  const input = render({ value: 'bananas' });

  await user.type(input, 'hello world');
  expect(input).toHaveValue('bananas');
  expect(input).toHaveDisplayValue('bananas');
});

test('should call onChange with input', async () => {
  const user = userEvent.setup();
  const onChange = spy();
  const input = render({ onChange });

  expect(onChange.notCalled).toBeTruthy();
  await user.type(input, 'hello world');
  expect(onChange.callCount).toEqual('hello world'.length);
  expect(onChange.lastCall.firstArg).toEqual('hello world');
});

test('should render disabled SearchField', () => {
  const input = render({ disabled: true });
  expect(input).toBeDisabled();
});

test('should support fieldRef prop', () => {
  const ref = createRef<HTMLInputElement>();
  render({ ref });

  expect(ref.current).toBeInstanceOf(HTMLInputElement);
  expect(ref.current).toEqual(
    screen.getByRole('searchbox', { name: 'search field' })
  );
});

test('should support className prop', () => {
  render({ label: 'search field', className: 'banana' });
  expect(screen.getByRole('searchbox', { name: 'search field' })).toHaveClass(
    'Field__text-input',
    'banana'
  );
});

test('should support name prop', () => {
  const input = render({ name: 'search', value: 'bananas' });
  expect(input).toHaveAttribute('name', 'search');
  expect(input).toHaveValue('bananas');
  expect(input).toHaveDisplayValue('bananas');
});

test('should have no axe violations with SearchField', async () => {
  const input = render();
  const results = await axe(input);
  expect(results).toHaveNoViolations();
});

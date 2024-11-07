import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spy } from 'sinon';
import { axe } from 'jest-axe';
import RadioGroup from './';

type SetOptional<T, Keys extends keyof T> = Pick<Partial<T>, Keys> &
  Omit<T, Keys>;
type RadioGroupProps = SetOptional<
  React.ComponentProps<typeof RadioGroup>,
  'aria-label' | 'radios'
>;

const defaultOptions: RadioGroupProps['radios'] = [
  { id: '1', label: 'Red', value: 'red' },
  { id: '2', label: 'Blue', value: 'blue' },
  { id: '3', label: 'Green', value: 'green' }
];

const renderRadioGroup = ({
  'aria-label': ariaLabel,
  name,
  radios,
  ...props
}: RadioGroupProps = {}): HTMLInputElement[] => {
  render(
    <RadioGroup
      aria-label={ariaLabel || 'radio group'}
      name={name || 'radios'}
      radios={radios || defaultOptions}
      {...props}
    />
  );
  return screen.queryAllByRole('radio', {
    name: ariaLabel as string
  }) as HTMLInputElement[];
};

test('should render radio group', () => {
  const inputs = renderRadioGroup();
  expect(inputs).toHaveLength(3);
  for (const index in defaultOptions) {
    expect(inputs[index]).toBeInTheDocument();
    expect(
      screen.queryByText(defaultOptions[index].label as string)
    ).toBeInTheDocument();
  }
  expect(screen.getByRole('radiogroup')).toBeInTheDocument();
});

test('shound render disabled radio group item', () => {
  const optionsWithDisabledOption = [
    ...defaultOptions,
    { id: '4', label: 'Yellow', value: 'yellow', disabled: true }
  ];
  const inputs = renderRadioGroup({ radios: optionsWithDisabledOption });
  for (const index in defaultOptions) {
    expect(inputs[index]).not.toBeDisabled();
  }
  expect(inputs[inputs.length - 1]).toBeDisabled();
});

test('should support value prop', () => {
  render(
    <form data-testid="form">
      <RadioGroup
        aria-label="radio group"
        radios={defaultOptions}
        name="radios"
        value="green"
      />
    </form>
  );
  const inputs = screen.queryAllByRole('radio') as HTMLInputElement[];
  expect(inputs[0]).not.toBeChecked();
  expect(inputs[1]).not.toBeChecked();
  expect(inputs[2]).toBeChecked();
  const form = screen.getByTestId('form');
  expect(form).toHaveFormValues({ radios: 'green' });
});

test('should support defaultValue prop', () => {
  render(
    <form data-testid="form">
      <RadioGroup
        aria-label="radio group"
        radios={defaultOptions}
        name="radios"
        defaultValue="green"
      />
    </form>
  );
  const inputs = screen.queryAllByRole('radio') as HTMLInputElement[];
  expect(inputs[0]).not.toBeChecked();
  expect(inputs[1]).not.toBeChecked();
  expect(inputs[2]).toBeChecked();
  const form = screen.getByTestId('form');
  expect(form).toHaveFormValues({ radios: 'green' });
});

test('should support labelDescription for radio group items', () => {
  const optionWithLabelDescription = {
    id: '4',
    label: 'Yellow',
    value: 'yellow',
    labelDescription: 'like a banana'
  };
  const optionsWithLabelDescription = [
    ...defaultOptions,
    optionWithLabelDescription
  ];
  const inputs = renderRadioGroup({ radios: optionsWithLabelDescription });
  expect(inputs[inputs.length - 1]).toHaveAccessibleDescription(
    optionWithLabelDescription.labelDescription
  );
  expect(
    screen.queryByText(optionWithLabelDescription.labelDescription)
  ).toBeInTheDocument();
});

test('should support inline prop', () => {
  renderRadioGroup({ inline: true });
  expect(screen.getByRole('radiogroup')).toHaveClass('Radio--inline');
});

test('should support className prop', () => {
  renderRadioGroup({ inline: true, className: 'banana' });
  expect(screen.getByRole('radiogroup')).toHaveClass('Radio--inline', 'banana');
});

test('should support ref prop', () => {
  const ref = createRef<HTMLDivElement>();
  renderRadioGroup({ ref });
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toEqual(screen.queryByRole('radiogroup'));
});

test('should toggle radio correctly', async () => {
  const user = userEvent.setup();
  const [input] = renderRadioGroup();
  const radioIcon = input.parentElement!.querySelector(
    '.Radio__overlay'
  ) as HTMLElement;
  expect(radioIcon).toHaveClass('Icon--radio-unchecked');
  expect(radioIcon).not.toHaveClass('Icon--radio-checked');
  expect(input).not.toBeChecked();

  await user.click(radioIcon);
  expect(radioIcon).not.toHaveClass('Icon--radio-unchecked');
  expect(radioIcon).toHaveClass('Icon--radio-checked');
});

test('should handle focus correctly', async () => {
  const user = userEvent.setup();
  const onFocus = spy();
  const [input] = renderRadioGroup({ onFocus });
  const radioIcon = input.parentElement!.querySelector(
    '.Radio__overlay'
  ) as HTMLElement;
  expect(radioIcon).not.toHaveClass('.Radio__overlay--focused');
  expect(onFocus.notCalled).toBeTruthy();

  await user.tab(); // focus on the input
  expect(input).toHaveFocus();
  expect(radioIcon).toHaveClass('Radio__overlay--focused');
  expect(onFocus.calledOnce).toBeTruthy();
});

test('should handle blur correctly', () => {
  const onBlur = spy();
  const [input] = renderRadioGroup({ onBlur });
  const radioIcon = input.parentElement!.querySelector(
    '.Radio__overlay'
  ) as HTMLElement;
  expect(radioIcon).not.toHaveClass('.Radio__overlay--focused');
  expect(onBlur.notCalled).toBeTruthy();

  input.focus();
  input.blur();
  expect(input).not.toHaveFocus();
  expect(radioIcon).not.toHaveClass('Radio__overlay--focused');
  expect(onBlur.calledOnce).toBeTruthy();
});

test('should handle onChange correctly', async () => {
  const user = userEvent.setup();
  const onChange = spy();
  const [input] = renderRadioGroup({ onChange });

  expect(onChange.notCalled).toBeTruthy();
  await user.click(input);
  expect(onChange.calledOnce).toBeTruthy();
  expect(onChange.calledWith(defaultOptions[0], input));
});

test('should have no axe violations', async () => {
  renderRadioGroup();
  const group = screen.getByRole('radiogroup');
  const results = await axe(group);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with disabled radio item', async () => {
  const optionsWithDisabledOption = [
    ...defaultOptions,
    { id: '4', label: 'Yellow', value: 'yellow', disabled: true }
  ];
  renderRadioGroup({ radios: optionsWithDisabledOption });
  const group = screen.getByRole('radiogroup');
  const results = await axe(group);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with radio item and labelDescription', async () => {
  const optionsWithDisabledOption = [
    ...defaultOptions,
    {
      id: '4',
      label: 'Yellow',
      value: 'yellow',
      labelDescription: 'like a banana'
    }
  ];
  renderRadioGroup({ radios: optionsWithDisabledOption });
  const group = screen.getByRole('radiogroup');
  const results = await axe(group);
  expect(results).toHaveNoViolations();
});

import React, { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

const renderRadioGroup = (props: RadioGroupProps = {}): HTMLInputElement[] => {
  const {
    'aria-label': ariaLabel = 'radio group',
    name = 'radios',
    radios = defaultOptions,
    groupLabel = 'radio group',
    ...rest
  } = props;

  render(
    <RadioGroup
      aria-label={ariaLabel}
      name={name}
      radios={radios}
      groupLabel={groupLabel}
      {...rest}
    />
  );

  return screen.queryAllByRole('radio') as HTMLInputElement[];
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
  const inputs = renderRadioGroup({
    radios: optionsWithDisabledOption,
    groupLabel: 'radio group'
  });
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
        groupLabel="radio group"
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
        groupLabel="radio group"
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
  const inputs = renderRadioGroup({
    radios: optionsWithLabelDescription,
    groupLabel: 'radio group'
  });
  expect(inputs[inputs.length - 1]).toHaveAccessibleDescription(
    optionWithLabelDescription.labelDescription
  );
  expect(
    screen.queryByText(optionWithLabelDescription.labelDescription)
  ).toBeInTheDocument();
});

test('should support inline prop', () => {
  renderRadioGroup({ inline: true, groupLabel: 'radio group' });
  expect(screen.getByRole('radiogroup')).toHaveClass('Radio--inline');
});

test('should support className prop', () => {
  renderRadioGroup({
    inline: true,
    className: 'banana',
    groupLabel: 'radio group'
  });
  expect(screen.getByRole('radiogroup')).toHaveClass('Radio--inline', 'banana');
});

test('should support ref prop', () => {
  const ref = createRef<HTMLFieldSetElement>();
  renderRadioGroup({ ref });
  expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
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
  const [input] = renderRadioGroup({ onFocus, groupLabel: 'radio group' });
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

test('should handle blur correctly', async () => {
  const onBlur = spy();
  const [input] = renderRadioGroup({ onBlur, groupLabel: 'radio group' });
  const radioIcon = input.parentElement!.querySelector(
    '.Radio__overlay'
  ) as HTMLElement;
  expect(radioIcon).not.toHaveClass('.Radio__overlay--focused');
  expect(onBlur.notCalled).toBeTruthy();

  await waitFor(() => {
    input.focus();
    input.blur();
    expect(input).not.toHaveFocus();
  });
  expect(radioIcon).not.toHaveClass('Radio__overlay--focused');
  expect(onBlur.calledOnce).toBeTruthy();
});

test('should handle onChange correctly', async () => {
  const user = userEvent.setup();
  const onChange = spy();
  const [input] = renderRadioGroup({ onChange, groupLabel: 'radio group' });

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
  renderRadioGroup({
    radios: optionsWithDisabledOption,
    groupLabel: 'radio group'
  });
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
  renderRadioGroup({
    radios: optionsWithDisabledOption,
    groupLabel: 'radio group'
  });
  const group = screen.getByRole('radiogroup');
  const results = await axe(group);
  expect(results).toHaveNoViolations();
});

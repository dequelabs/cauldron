import React, { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spy } from 'sinon';
import { axe } from 'jest-axe';
import RadioGroup, { RadioItem } from './';

type SetOptional<T, Keys extends keyof T> = Pick<Partial<T>, Keys> &
  Omit<T, Keys>;
type RadioGroupProps = SetOptional<
  React.ComponentProps<typeof RadioGroup>,
  'aria-label' | 'radios'
>;

const defaultOptions: RadioItem[] = [
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

test('should handle blur correctly', async () => {
  const onBlur = spy();
  const [input] = renderRadioGroup({ onBlur });
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

describe('radio icon overlay click regression', () => {
  test('should select any radio when clicking its icon overlay', async () => {
    const user = userEvent.setup();
    renderRadioGroup();
    const inputs = screen.getAllByRole('radio') as HTMLInputElement[];

    for (let i = 0; i < inputs.length; i++) {
      const radioIcon = inputs[i].parentElement!.querySelector(
        '.Radio__overlay'
      ) as HTMLElement;
      await user.click(radioIcon);
      expect(inputs[i]).toBeChecked();
    }
  });

  test('should select radio via icon overlay after re-render', async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [count, setCount] = useState(0);
      return (
        <div>
          <button onClick={() => setCount((c) => c + 1)}>
            Re-render ({count})
          </button>
          <RadioGroup
            aria-label="radio group"
            name="radios"
            radios={defaultOptions}
          />
        </div>
      );
    }

    render(<Wrapper />);

    // Force several re-renders
    const rerenderButton = screen.getByRole('button', {
      name: /Re-render/
    });
    await user.click(rerenderButton);
    await user.click(rerenderButton);
    await user.click(rerenderButton);

    // Now click each radio's icon overlay — all should still work
    const inputs = screen.getAllByRole('radio') as HTMLInputElement[];
    for (let i = 0; i < inputs.length; i++) {
      const radioIcon = inputs[i].parentElement!.querySelector(
        '.Radio__overlay'
      ) as HTMLElement;
      await user.click(radioIcon);
      expect(inputs[i]).toBeChecked();
    }
  });

  test('should select radio via icon overlay after radios prop changes', async () => {
    const user = userEvent.setup();
    const extendedOptions = [
      ...defaultOptions,
      { id: '4', label: 'Yellow', value: 'yellow' }
    ];

    function Wrapper() {
      const [options, setOptions] = useState(defaultOptions);
      return (
        <div>
          <button onClick={() => setOptions(extendedOptions)}>
            Add option
          </button>
          <RadioGroup aria-label="radio group" name="radios" radios={options} />
        </div>
      );
    }

    render(<Wrapper />);

    // Initially 3 radios
    expect(screen.getAllByRole('radio')).toHaveLength(3);

    // Add a 4th radio
    await user.click(screen.getByRole('button', { name: /Add option/ }));
    const inputs = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(inputs).toHaveLength(4);

    // Click the newly added radio's icon overlay
    const newRadioIcon = inputs[3].parentElement!.querySelector(
      '.Radio__overlay'
    ) as HTMLElement;
    await user.click(newRadioIcon);
    expect(inputs[3]).toBeChecked();

    // Verify previously existing radios still work via icon overlay
    const firstRadioIcon = inputs[0].parentElement!.querySelector(
      '.Radio__overlay'
    ) as HTMLElement;
    await user.click(firstRadioIcon);
    expect(inputs[0]).toBeChecked();
  });

  test('should select the correct radio via icon overlay after radios are reordered', async () => {
    const user = userEvent.setup();
    const reversedOptions: RadioItem[] = [...defaultOptions].reverse();

    function Wrapper() {
      const [options, setOptions] = useState(defaultOptions);
      return (
        <div>
          <button onClick={() => setOptions(reversedOptions)}>
            Reverse order
          </button>
          <RadioGroup aria-label="radio group" name="radios" radios={options} />
        </div>
      );
    }

    render(<Wrapper />);

    // Before reorder: Red, Blue, Green
    let inputs = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(inputs[0]).toHaveAttribute('value', 'red');
    expect(inputs[2]).toHaveAttribute('value', 'green');

    // Reorder to: Green, Blue, Red
    await user.click(screen.getByRole('button', { name: /Reverse order/ }));

    inputs = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(inputs[0]).toHaveAttribute('value', 'green');
    expect(inputs[2]).toHaveAttribute('value', 'red');

    // Click each icon overlay and verify the correct (reordered) radio is selected
    for (let i = 0; i < inputs.length; i++) {
      const radioIcon = inputs[i].parentElement!.querySelector(
        '.Radio__overlay'
      ) as HTMLElement;
      await user.click(radioIcon);
      expect(inputs[i]).toBeChecked();
    }
  });

  test('should select radio via icon overlay after radios are removed', async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [options, setOptions] = useState(defaultOptions);
      return (
        <div>
          <button onClick={() => setOptions(defaultOptions.slice(0, 2))}>
            Remove last
          </button>
          <RadioGroup aria-label="radio group" name="radios" radios={options} />
        </div>
      );
    }

    render(<Wrapper />);

    expect(screen.getAllByRole('radio')).toHaveLength(3);

    // Remove the last radio
    await user.click(screen.getByRole('button', { name: /Remove last/ }));
    const inputs = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(inputs).toHaveLength(2);

    // Remaining radios should still be selectable via icon overlay
    for (let i = 0; i < inputs.length; i++) {
      const radioIcon = inputs[i].parentElement!.querySelector(
        '.Radio__overlay'
      ) as HTMLElement;
      await user.click(radioIcon);
      expect(inputs[i]).toBeChecked();
    }
  });
});

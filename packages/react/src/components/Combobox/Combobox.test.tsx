import React, { createRef } from 'react';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { spy } from 'sinon';
import { axe } from 'jest-axe';
import Combobox from './Combobox';
import ComboboxGroup from './ComboboxGroup';
import ComboboxOption from './ComboboxOption';

// Utility function for checking if the ComboboxListbox is currently open
const assertListboxIsOpen = (isOpen: boolean) => {
  const Listbox = screen.getByRole('listbox');
  const input = screen.getByRole('combobox');
  expect(JSON.parse(input.getAttribute('aria-expanded') + '')).toEqual(isOpen);
  if (isOpen) {
    expect(Array.from(Listbox.classList)).toContain('Combobox__listbox--open');
  } else {
    expect(Array.from(Listbox.classList)).not.toContain(
      'Combobox__listbox--open'
    );
  }
};

// Utility function for checking for active element for the given Combobox Option of a Combobox component
const assertOptionIsActive = (index: number) => {
  const combobox = screen.getByRole('combobox');
  const options = screen.queryAllByRole('option');
  const activeOption = options.at(index);
  expect(combobox.getAttribute('aria-activedescendant')).toBeTruthy();
  expect(combobox.getAttribute('aria-activedescendant')).toEqual(
    activeOption?.getAttribute('id')
  );
  expect(
    activeOption?.classList.contains('ComboboxOption--active')
  ).toBeTruthy();
  options.forEach(
    (option, index) =>
      index !== index &&
      expect(option.classList.contains('ComboboxOption--active')).toBeFalsy()
  );
};

// Utility function for checking for active element for the given Combobox Option of a Combobox component
const assertOptionIsSelected = (index: number) => {
  const options = screen.queryAllByRole('option');
  const selectedOption = options.at(index);
  expect(
    JSON.parse(selectedOption?.getAttribute('aria-selected') + '')
  ).toEqual(true);
  options.forEach(
    (option, index) =>
      index !== index &&
      expect(option.getAttribute('aria-selected')).toEqual(false)
  );
};

const assertOptionsAreSelected = (...indexes: number[]) => {
  const options = screen.queryAllByRole('option');
  for (let i = 0; i < options.length; ++i) {
    const selected = JSON.parse(options[i]?.getAttribute('aria-selected') + '');
    if (indexes.includes(i)) {
      expect(selected).toBeTruthy();
    } else {
      expect(selected).toBeFalsy();
    }
  }
};

test('should render combobox with options', () => {
  const options = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Banana', label: 'Banana' },
    { value: 'Cantaloupe', label: 'Cantaloupe' }
  ];
  render(<Combobox label="label" options={options} />);
  expect(screen.queryByRole('combobox')).toBeTruthy();
  expect(screen.queryAllByRole('option').at(0)?.innerText).toEqual('Apple');
  expect(screen.queryAllByRole('option').at(1)?.innerText).toEqual('Banana');
  expect(screen.queryAllByRole('option').at(2)?.innerText).toEqual(
    'Cantaloupe'
  );
});

test('should render combobox with children', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(screen.queryByRole('combobox')).toBeTruthy();
  expect(screen.queryAllByRole('option').at(0)?.innerText).toEqual('Apple');
  expect(screen.queryAllByRole('option').at(1)?.innerText).toEqual('Banana');
  expect(screen.queryAllByRole('option').at(2)?.innerText).toEqual(
    'Cantaloupe'
  );
});

test('should render combobox options with description', () => {
  const options = [
    {
      value: 'Apple',
      label: 'Apple',
      description:
        'A crispy orb of deliciousness that comes in colors from "stoplight red" to "alien green".'
    },
    {
      value: 'Banana',
      label: 'Banana',
      description:
        'This curvy wonder brings the tropics to your taste buds with its sunny disposition.'
    },
    {
      value: 'Cantaloupe',
      label: 'Cantaloupe',
      description: 'A bumpy, juicy, orb with moist deliciousness inside.'
    }
  ];
  render(<Combobox label="label" options={options} />);
  expect(screen.queryByRole('combobox')).toBeTruthy();
  expect(
    screen
      .queryAllByRole('option')
      .at(0)
      ?.querySelector('.ComboboxOption__description')?.textContent
  ).toEqual(options[0].description);
  expect(
    screen
      .queryAllByRole('option')
      .at(1)
      ?.querySelector('.ComboboxOption__description')?.textContent
  ).toEqual(options[1].description);
  expect(
    screen
      .queryAllByRole('option')
      .at(2)
      ?.querySelector('.ComboboxOption__description')?.textContent
  ).toEqual(options[2].description);
});

test('should render combobox children with description', () => {
  const options = [
    {
      value: 'Apple',
      label: 'Apple',
      description:
        'A crispy orb of deliciousness that comes in colors from "stoplight red" to "alien green".'
    },
    {
      value: 'Banana',
      label: 'Banana',
      description:
        'This curvy wonder brings the tropics to your taste buds with its sunny disposition.'
    },
    {
      value: 'Cantaloupe',
      label: 'Cantaloupe',
      description: 'A bumpy, juicy, orb with moist deliciousness inside.'
    }
  ];
  const children = options.map(({ value, label, description }, index) => (
    <ComboboxOption key={index} value={value} description={description}>
      {label}
    </ComboboxOption>
  ));
  render(<Combobox label="label">{children}</Combobox>);
  expect(screen.queryByRole('combobox')).toBeTruthy();
  expect(
    screen
      .queryAllByRole('option')
      .at(0)
      ?.querySelector('.ComboboxOption__description')?.textContent
  ).toEqual(options[0].description);
  expect(
    screen
      .queryAllByRole('option')
      .at(1)
      ?.querySelector('.ComboboxOption__description')?.textContent
  ).toEqual(options[1].description);
  expect(
    screen
      .queryAllByRole('option')
      .at(2)
      ?.querySelector('.ComboboxOption__description')?.textContent
  ).toEqual(options[2].description);
});

test('should render combobox with groups', () => {
  render(
    <Combobox label="label">
      <ComboboxGroup label="Fruit">
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cantaloupe</ComboboxOption>
      </ComboboxGroup>
      <ComboboxGroup label="Vegetables">
        <ComboboxOption>Artichoke</ComboboxOption>
        <ComboboxOption>Broccoli</ComboboxOption>
        <ComboboxOption>Carrots</ComboboxOption>
      </ComboboxGroup>
    </Combobox>
  );

  const group1 = screen.queryAllByRole('group').at(0) as HTMLElement;
  const group2 = screen.queryAllByRole('group').at(1) as HTMLElement;

  expect(screen.queryByRole('combobox')).toBeTruthy();
  expect(group1).toBeTruthy();
  expect(group2).toBeTruthy();
  expect(group1.tagName).toEqual('UL');
  expect(group2.tagName).toEqual('UL');
  expect(group1.getAttribute('aria-labelledby')).toBeTruthy();
  expect(group2.getAttribute('aria-labelledby')).toBeTruthy();
  expect(within(group1).queryAllByRole('option').at(0)?.innerText).toEqual(
    'Apple'
  );
  expect(within(group1).queryAllByRole('option').at(1)?.innerText).toEqual(
    'Banana'
  );
  expect(within(group1).queryAllByRole('option').at(2)?.innerText).toEqual(
    'Cantaloupe'
  );
  expect(within(group2).queryAllByRole('option').at(0)?.innerText).toEqual(
    'Artichoke'
  );
  expect(within(group2).queryAllByRole('option').at(1)?.innerText).toEqual(
    'Broccoli'
  );
  expect(within(group2).queryAllByRole('option').at(2)?.innerText).toEqual(
    'Carrots'
  );
});

test('should render required combobox', () => {
  render(
    <Combobox label="label" required>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(screen.getByRole('combobox').hasAttribute('required')).toEqual(true);
  expect(screen.queryByText('Required')).toBeTruthy();
});

test('should render combobox with error', () => {
  const errorId = 'combo-error';
  render(
    <Combobox
      label="label"
      aria-describedby="other-id"
      required
      error="You forgot to choose a value."
      id="combo"
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(screen.queryByText('You forgot to choose a value.')).toBeTruthy();
  expect(screen.getByRole('combobox')).toHaveAttribute(
    'aria-describedby',
    `other-id ${errorId}`
  );
});

test('should render combobox with both description and error', () => {
  const errorId = 'combo-error';
  const descriptionId = 'combo-description';
  render(
    <Combobox
      label="label"
      aria-describedby="other-id"
      required
      description="This is a description"
      error="You forgot to choose a value."
      id="combo"
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(screen.queryByText('This is a description')).toBeTruthy();
  expect(screen.queryByText('You forgot to choose a value.')).toBeTruthy();
  expect(screen.getByRole('combobox').getAttribute('aria-describedby')).toBe(
    `other-id ${descriptionId} ${errorId}`
  );
});

test('should open combobox listbox on click', async () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  assertListboxIsOpen(false);
  fireEvent.click(screen.getByRole('combobox'));
  assertListboxIsOpen(true);
});

test('should maintain focus on combobox input on click', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  assertListboxIsOpen(false);
  expect(screen.getByRole('combobox')).not.toHaveFocus();
  screen
    .getByRole('combobox')
    .addEventListener('click', (event: MouseEvent) => {
      // simulate a focus from a click
      (event.target as HTMLInputElement)?.focus();
    });
  fireEvent.click(screen.getByRole('combobox'));
  assertListboxIsOpen(true);
  expect(screen.getByRole('combobox')).toHaveFocus();
});

test('should allow an input ref to be passed to the combobox', () => {
  const inputRef = React.createRef<HTMLInputElement>();
  render(
    <Combobox label="label" inputRef={inputRef}>
      <ComboboxOption>Apple</ComboboxOption>
    </Combobox>
  );

  expect(inputRef.current).toBeTruthy();
  expect(inputRef.current).toEqual(screen.getByRole('combobox'));
});

test('should open combobox listbox on focus', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  assertListboxIsOpen(false);
  fireEvent.focus(screen.getByRole('combobox'));
  assertListboxIsOpen(true);
});

test('should open combobox listbox on keypress', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  assertListboxIsOpen(false);
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
  assertListboxIsOpen(true);
});

test('should close combobox listbox on "esc" keypress', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  assertListboxIsOpen(false);
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'A' });
  assertListboxIsOpen(true);
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
  assertListboxIsOpen(false);
});

test('should not open combobox listbox on "enter" keypress', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  assertListboxIsOpen(false);
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
  assertListboxIsOpen(false);
});

test('should close combobox listbox on "blur"', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  assertListboxIsOpen(false);
  fireEvent.focus(screen.getByRole('combobox'));
  assertListboxIsOpen(true);
  fireEvent.blur(screen.getByRole('combobox'));
  assertListboxIsOpen(false);
});

test('should close combobox listbox when selecting option via click', async () => {
  const user = userEvent.setup();
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  assertListboxIsOpen(false);
  await user.tab();
  assertListboxIsOpen(true);
  await user.click(screen.getAllByRole('option')[0]);
  assertListboxIsOpen(false);
});

test('should select multiple combobox options via clicks', () => {
  render(
    <Combobox label="label" multiselect>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  fireEvent.click(screen.getAllByRole('option')[0]);
  fireEvent.blur(combobox);

  fireEvent.focus(combobox);
  fireEvent.click(screen.getAllByRole('option')[1]);
  fireEvent.blur(combobox);

  const pills = screen.getAllByRole('button');
  expect(pills).toHaveLength(2);
  expect(pills[0]).toHaveAccessibleName('remove Apple');
  expect(pills[1]).toHaveAccessibleName('remove Banana');
});

test('should select multiple combobox options via clicks, custom remove value aria label', () => {
  render(
    <Combobox label="label" multiselect>
      <ComboboxOption removeOptionLabel="Remove and forget Apple">
        Apple
      </ComboboxOption>
      <ComboboxOption removeOptionLabel="Remove and forget Banana">
        Banana
      </ComboboxOption>
      <ComboboxOption removeOptionLabel="Remove and forget Cantaloupe">
        Cantaloupe
      </ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  fireEvent.click(screen.getAllByRole('option')[0]);
  fireEvent.blur(combobox);

  fireEvent.focus(combobox);
  fireEvent.click(screen.getAllByRole('option')[1]);
  fireEvent.blur(combobox);

  const pills = screen.getAllByRole('button');
  expect(pills).toHaveLength(2);
  expect(pills[0]).toHaveAccessibleName('Remove and forget Apple');
  expect(pills[1]).toHaveAccessibleName('Remove and forget Banana');
});

test('should prevent default on combobox listbox option via mousedown', () => {
  const preventDefault = spy();
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const option = screen.getAllByRole('option')[0];
  const fireMouseDownEvent = () => {
    const event = createEvent.mouseDown(option);
    // rtl doesn't let us mock preventDefault
    // see: https://github.com/testing-library/react-testing-library/issues/572
    event.preventDefault = preventDefault;
    fireEvent(option, event);
  };

  assertListboxIsOpen(false);
  fireEvent.focus(screen.getByRole('combobox'));
  assertListboxIsOpen(true);
  expect(preventDefault.notCalled).toBeTruthy();
  fireMouseDownEvent();
  expect(preventDefault.calledOnce).toBeTruthy();
});

test('should close combobox listbox when selecting option via keypress', () => {
  render(
    <Combobox label="label" multiselect>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.keyDown(combobox, { key: 'Enter' });
  fireEvent.blur(combobox);

  fireEvent.focus(combobox);
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.keyDown(combobox, { key: 'Enter' });
  fireEvent.blur(combobox);

  const pills = screen.getAllByRole('button');
  expect(pills).toHaveLength(2);
  expect(pills[0]).toHaveAccessibleName('remove Apple');
  expect(pills[1]).toHaveAccessibleName('remove Banana');
});

test('should select multiple combobox options via keypresses', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  assertListboxIsOpen(false);
  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.keyDown(combobox, { key: 'Enter' });
  assertListboxIsOpen(false);
});

test('should set combobox value when selecting option via mousedown when passed children', () => {
  render(
    <Combobox label="label">
      <ComboboxOption value="apple">Apple</ComboboxOption>
      <ComboboxOption value="banana">Banana</ComboboxOption>
      <ComboboxOption value="cantaloupe">Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  fireEvent.focus(combobox);
  fireEvent.click(screen.getAllByRole('option')[0]);
  expect(screen.getByRole('combobox')).toHaveDisplayValue('apple');
});

test('should not set multiselect combobox value when selecting second option via mousedown when passed children', () => {
  render(
    <Combobox label="label" multiselect>
      <ComboboxOption value="apple">Apple</ComboboxOption>
      <ComboboxOption value="banana">Banana</ComboboxOption>
      <ComboboxOption value="cantaloupe">Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  fireEvent.click(screen.getAllByRole('option')[0]);
  expect(screen.getByRole('combobox')).toHaveDisplayValue('');
  fireEvent.blur(combobox);

  fireEvent.focus(combobox);
  fireEvent.click(screen.getAllByRole('option')[1]);
  expect(screen.getByRole('combobox')).toHaveDisplayValue('');
});

test('should set combobox value when selecting option via keypress when passed children', () => {
  render(
    <Combobox label="label">
      <ComboboxOption value="apple">Apple</ComboboxOption>
      <ComboboxOption value="banana">Banana</ComboboxOption>
      <ComboboxOption value="cantaloupe">Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  fireEvent.focus(combobox);
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.keyDown(combobox, { key: 'Enter' });
  expect(screen.getByRole('combobox')).toHaveDisplayValue('apple');
});

test('should set multiselect combobox value when selecting second option via keypress when passed children', () => {
  render(
    <Combobox label="label">
      <ComboboxOption value="apple">Apple</ComboboxOption>
      <ComboboxOption value="banana">Banana</ComboboxOption>
      <ComboboxOption value="cantaloupe">Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.keyDown(combobox, { key: 'Enter' });
  expect(screen.getByRole('combobox')).toHaveDisplayValue('apple');
  fireEvent.blur(combobox);

  fireEvent.focus(combobox);
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.keyDown(combobox, { key: 'Enter' });
  expect(screen.getByRole('combobox')).toHaveDisplayValue('banana');
});

test('should set combobox value when selecting option via mousedown when passed options', () => {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cantaloupe', label: 'Cantaloupe' }
  ];
  render(<Combobox label="label" options={options} />);

  const combobox = screen.getByRole('combobox');
  fireEvent.focus(combobox);
  fireEvent.click(screen.getAllByRole('option')[0]);
  expect(screen.getByRole('combobox')).toHaveDisplayValue('apple');
});

test('should not set multiselect combobox value when selecting second option via mousedown when passed options', () => {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cantaloupe', label: 'Cantaloupe' }
  ];
  render(<Combobox label="label" multiselect options={options} />);

  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  fireEvent.click(screen.getAllByRole('option')[0]);
  expect(screen.getByRole('combobox')).toHaveDisplayValue('');
  fireEvent.blur(combobox);

  fireEvent.focus(combobox);
  fireEvent.click(screen.getAllByRole('option')[1]);
  expect(screen.getByRole('combobox')).toHaveDisplayValue('');
});

test('should set combobox value when selecting option via keypress when passed options', () => {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cantaloupe', label: 'Cantaloupe' }
  ];
  render(<Combobox label="label" options={options} />);

  const combobox = screen.getByRole('combobox');
  fireEvent.focus(combobox);
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.keyDown(combobox, { key: 'Enter' });
  expect(screen.getByRole('combobox')).toHaveDisplayValue('apple');
});

test('should not set multiselect combobox value when selecting  second option via keypress when passed options', () => {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cantaloupe', label: 'Cantaloupe' }
  ];
  render(<Combobox label="label" multiselect options={options} />);

  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.keyDown(combobox, { key: 'Enter' });
  expect(screen.getByRole('combobox')).toHaveDisplayValue('');
  fireEvent.blur(combobox);

  fireEvent.focus(combobox);
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.keyDown(combobox, { key: 'Enter' });
  expect(screen.getByRole('combobox')).toHaveDisplayValue('');
});

test('should prevent default with enter keypress and open listbox', () => {
  const preventDefault = spy();
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  const fireSyntheticEvent = (type: keyof typeof createEvent, options = {}) => {
    const event = createEvent[type](combobox, options);
    // rtl doesn't let us mock preventDefault
    // see: https://github.com/testing-library/react-testing-library/issues/572
    event.preventDefault = preventDefault;
    if (type === 'focus') {
      fireEvent.focusIn(combobox);
    }
    fireEvent(combobox, event);
  };

  assertListboxIsOpen(false);
  fireSyntheticEvent('focus', { preventDefault });
  expect(preventDefault.notCalled).toBeTruthy();
  assertListboxIsOpen(true);
  fireSyntheticEvent('keyDown', { key: 'ArrowDown', preventDefault });
  expect(preventDefault.notCalled).toBeTruthy();
  fireSyntheticEvent('keyDown', { key: 'Enter', preventDefault });
  assertListboxIsOpen(false);
  expect(preventDefault.calledOnce).toBeTruthy();
});

test('should not prevent default with enter keypress and closed listbox', () => {
  const preventDefault = spy();
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  const fireSyntheticEvent = (type: keyof typeof createEvent, options = {}) => {
    const event = createEvent[type](combobox, options);
    // rtl doesn't let us mock preventDefault
    // see: https://github.com/testing-library/react-testing-library/issues/572
    event.preventDefault = preventDefault;
    if (type === 'focus') {
      fireEvent.focusIn(combobox);
    }
    fireEvent(combobox, event);
  };

  assertListboxIsOpen(false);
  fireSyntheticEvent('focus', { preventDefault });
  expect(preventDefault.notCalled).toBeTruthy();
  assertListboxIsOpen(true);
  fireSyntheticEvent('keyDown', { preventDefault, key: 'Escape' });
  assertListboxIsOpen(false);
  fireSyntheticEvent('keyDown', { preventDefault, key: 'Enter' });
  expect(preventDefault.notCalled).toBeTruthy();
});

test('should set aria-activedescendent for active combobox options', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');
  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom so we fire the events directly on listbox
  const fireArrowDownKeyPress = () =>
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });

  expect(combobox.hasAttribute('aria-activedescendant')).toBeFalsy();
  fireEvent.focus(combobox);
  assertListboxIsOpen(true);

  fireArrowDownKeyPress();
  assertOptionIsActive(0);
  fireArrowDownKeyPress();
  assertOptionIsActive(1);
  fireArrowDownKeyPress();
  assertOptionIsActive(2);
});

test('should set aria-activedescendent value with "value" prop', () => {
  render(
    <Combobox label="label" value="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  fireEvent.focus(combobox);
  assertOptionIsActive(1);
});

test('should set aria-activedescendent value with "defaultValue" prop', () => {
  render(
    <Combobox label="label" defaultValue="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  fireEvent.focus(combobox);
  assertOptionIsActive(1);
});

test('should prevent default event on home/end keypress', () => {
  const preventDefault = spy();
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  const fireKeydownEvent = (key: string) => {
    const event = createEvent.keyDown(combobox, { key });
    // rtl doesn't let us mock preventDefault
    // see: https://github.com/testing-library/react-testing-library/issues/572
    event.preventDefault = preventDefault;
    fireEvent(combobox, event);
  };
  expect(preventDefault.notCalled).toBeTruthy();
  fireKeydownEvent('Home');
  expect(preventDefault.callCount).toEqual(1);
  fireKeydownEvent('End');
  expect(preventDefault.callCount).toEqual(2);
  fireKeydownEvent('ArrowDown');
  expect(preventDefault.callCount).toEqual(2);
});

test('should call onActiveChange when active option changes', () => {
  const onActiveChange = spy();
  render(
    <Combobox label="label" onActiveChange={onActiveChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');
  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom so we fire the events directly on listbox
  const fireArrowDownKeyPress = () =>
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  expect(onActiveChange.notCalled).toBeTruthy();
  fireArrowDownKeyPress();
  expect(onActiveChange.callCount).toEqual(1);
  expect(onActiveChange.getCall(0).firstArg.value).toEqual('Apple');
  fireArrowDownKeyPress();
  expect(onActiveChange.callCount).toEqual(2);
  expect(onActiveChange.getCall(1).firstArg.value).toEqual('Banana');
  fireArrowDownKeyPress();
  expect(onActiveChange.callCount).toEqual(3);
  expect(onActiveChange.getCall(2).firstArg.value).toEqual('Cantaloupe');
});

test('should set input value to empty string on open with selected option', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireEvent.click(screen.getAllByRole('option')[1]);
  fireEvent.blur(combobox);
  assertListboxIsOpen(false);
  fireEvent.focus(combobox);
  expect(screen.getByRole('combobox')).toHaveDisplayValue('');
});

test('should restore input value to selected value on close with selected option', () => {
  render(
    <Combobox label="label">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireEvent.click(screen.getAllByRole('option')[1]);
  fireEvent.blur(combobox);
  assertListboxIsOpen(false);
  fireEvent.focus(combobox);
  fireEvent.blur(combobox);
  expect(screen.getByRole('combobox')).toHaveDisplayValue('Banana');
});

test('should handle selection with "click" event', () => {
  const onSelectionChange = spy();
  render(
    <Combobox label="label" onSelectionChange={onSelectionChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  fireEvent.click(screen.getAllByRole('option')[1]);
  expect(onSelectionChange.callCount).toEqual(1);
  expect(onSelectionChange.firstCall.firstArg.value).toEqual('Banana');
  assertOptionIsSelected(0);
  fireEvent.click(combobox);
  fireEvent.click(screen.getAllByRole('option')[2]);
  expect(onSelectionChange.secondCall.firstArg.value).toEqual('Cantaloupe');
  assertOptionIsSelected(0);
});

test('should handle multiple selections with "click" event', () => {
  const onSelectionChange = spy();
  render(
    <Combobox label="label" multiselect onSelectionChange={onSelectionChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  fireEvent.click(screen.getAllByRole('option')[1]);
  expect(onSelectionChange.callCount).toEqual(1);
  expect(onSelectionChange.firstCall.firstArg.value).toEqual(['Banana']);
  fireEvent.click(combobox);
  fireEvent.click(screen.getAllByRole('option')[2]);
  expect(onSelectionChange.secondCall.firstArg.value).toEqual([
    'Banana',
    'Cantaloupe'
  ]);
});

test('should remove selected option upon clicking on pill', () => {
  const onSelectionChange = spy();
  render(
    <Combobox label="label" multiselect onSelectionChange={onSelectionChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  fireEvent.click(screen.getAllByRole('option')[1]);
  expect(onSelectionChange.callCount).toEqual(1);
  expect(onSelectionChange.firstCall.firstArg.value).toEqual(['Banana']);
  fireEvent.click(combobox);
  fireEvent.click(screen.getAllByRole('option')[2]);
  expect(onSelectionChange.secondCall.firstArg.value).toEqual([
    'Banana',
    'Cantaloupe'
  ]);
  fireEvent.click(screen.getByRole('button', { name: 'remove Banana' }));
  expect(onSelectionChange.thirdCall.firstArg.value).toEqual(['Cantaloupe']);
});

test('should remove all selected options when clicking on pills', () => {
  const onSelectionChange = spy();
  render(
    <Combobox label="label" multiselect onSelectionChange={onSelectionChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  fireEvent.click(screen.getAllByRole('option')[1]);
  expect(onSelectionChange.callCount).toEqual(1);
  expect(onSelectionChange.firstCall.firstArg.value).toEqual(['Banana']);
  fireEvent.click(combobox);
  fireEvent.click(screen.getAllByRole('option')[2]);
  expect(onSelectionChange.secondCall.firstArg.value).toEqual([
    'Banana',
    'Cantaloupe'
  ]);
  fireEvent.click(screen.getByRole('button', { name: 'remove Banana' }));
  expect(onSelectionChange.thirdCall.firstArg.value).toEqual(['Cantaloupe']);
  fireEvent.click(screen.getByRole('button', { name: 'remove Cantaloupe' }));
  expect(onSelectionChange.getCalls()[3].firstArg.value).toEqual([]);
});

test('should handle selection with "enter" keydown event', () => {
  const onSelectionChange = spy();
  render(
    <Combobox label="label" onSelectionChange={onSelectionChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom so we fire the events directly on listbox
  const fireArrowDownKeyPress = () =>
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
  const fireEnterKeyPress = () =>
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  fireArrowDownKeyPress();
  fireEnterKeyPress();
  expect(onSelectionChange.callCount).toEqual(1);
  expect(onSelectionChange.firstCall.firstArg.value).toEqual('Apple');
  fireEvent.click(combobox);
  assertOptionIsSelected(0);
  fireArrowDownKeyPress();
  fireEnterKeyPress();
  expect(onSelectionChange.secondCall.firstArg.value).toEqual('Banana');
  fireEvent.click(combobox);
  assertOptionIsSelected(1);
  fireArrowDownKeyPress();
  fireEnterKeyPress();
});

test('should handle multiple selections with "enter" keydown event', () => {
  const onSelectionChange = spy();
  render(
    <Combobox label="label" multiselect onSelectionChange={onSelectionChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom so we fire the events directly on listbox
  const fireArrowDownKeyPress = () =>
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
  const fireEnterKeyPress = () =>
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  fireArrowDownKeyPress();
  fireEnterKeyPress();
  expect(onSelectionChange.callCount).toEqual(1);
  expect(onSelectionChange.firstCall.firstArg.value).toEqual(['Apple']);
  fireEvent.click(combobox);
  fireArrowDownKeyPress();
  fireEnterKeyPress();
  expect(onSelectionChange.secondCall.firstArg.value).toEqual([
    'Apple',
    'Banana'
  ]);
  fireEvent.click(combobox);
  fireArrowDownKeyPress();
  fireEnterKeyPress();
});

test('should handle selection when autocomplete="automatic" and combobox input is blurred', () => {
  const onSelectionChange = spy();
  render(
    <Combobox
      label="label"
      onSelectionChange={onSelectionChange}
      value=""
      autocomplete="automatic"
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom so we fire the events directly on listbox
  const fireArrowDownKeyPress = () =>
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  fireArrowDownKeyPress();
  fireEvent.blur(combobox);
  expect(onSelectionChange.calledOnce).toBeTruthy();
  expect(onSelectionChange.firstCall.firstArg.value).toEqual('Banana');
});

test('should handle multiple selections when autocomplete="automatic" and combobox input is blurred', () => {
  const onSelectionChange = spy();
  render(
    <Combobox
      label="label"
      onSelectionChange={onSelectionChange}
      multiselect
      autocomplete="automatic"
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom so we fire the events directly on listbox
  const fireArrowDownKeyPress = () =>
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  fireEvent.blur(combobox);
  expect(onSelectionChange.callCount).toEqual(1);
  expect(onSelectionChange.firstCall.firstArg.value).toEqual(['Apple']);

  fireEvent.click(combobox);
  fireArrowDownKeyPress();
  fireEvent.blur(combobox);
  expect(onSelectionChange.secondCall.firstArg.value).toEqual([
    'Apple',
    'Banana'
  ]);
});

test('should always render all options when autocomplete="none"', () => {
  render(
    <Combobox label="label" autocomplete="none">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireEvent.change(combobox, { target: { value: 'a' } });
  expect(screen.getAllByRole('option').length).toEqual(3);
  fireEvent.change(combobox, { target: { value: 'ap' } });
  expect(screen.getAllByRole('option').length).toEqual(3);
  fireEvent.change(combobox, { target: { value: 'apple' } });
  expect(screen.getAllByRole('option').length).toEqual(3);
});

test('should render matching options when autocomplete="manual"', () => {
  render(
    <Combobox label="label" autocomplete="manual">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireEvent.change(combobox, { target: { value: 'a' } });
  expect(screen.getAllByRole('option').length).toEqual(3);
  fireEvent.change(combobox, { target: { value: 'ap' } });
  expect(screen.getAllByRole('option').length).toEqual(1);
  expect(screen.getByRole('option').innerText).toEqual('Apple');
});

test('should render results not found when no options match when autocomplete="manual"', () => {
  render(
    <Combobox label="label" autocomplete="manual">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireEvent.change(combobox, { target: { value: 'x' } });
  expect(screen.queryAllByRole('listbox').length).toEqual(0);
  expect(screen.queryAllByRole('option').length).toEqual(0);
  expect(screen.queryByText('No results found.')).toBeTruthy();
});

test('should render results not found render function when no options match when autocomplete="manual"', () => {
  render(
    <Combobox
      label="label"
      autocomplete="manual"
      renderNoResults={() => (
        <span className="no-results">Yo, no results found here.</span>
      )}
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireEvent.change(combobox, { target: { value: 'x' } });
  expect(screen.queryAllByRole('option').length).toEqual(0);
  expect(screen.queryByText('Yo, no results found here.')).toBeTruthy();
});

test('should render results not found render component when no options match when autocomplete="manual"', () => {
  render(
    <Combobox
      label="label"
      autocomplete="manual"
      renderNoResults={
        <span className="no-results">Yo, no results found here.</span>
      }
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireEvent.change(combobox, { target: { value: 'x' } });
  expect(screen.queryAllByRole('option').length).toEqual(0);
  expect(screen.queryByText('Yo, no results found here.')).toBeTruthy();
});

test('should render matching options when autocomplete="automatic"', () => {
  render(
    <Combobox label="label" autocomplete="automatic">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireEvent.change(combobox, { target: { value: 'a' } });
  expect(screen.getAllByRole('option').length).toEqual(3);
  fireEvent.change(combobox, { target: { value: 'ap' } });
  expect(screen.getAllByRole('option').length).toEqual(1);
  expect(screen.getByRole('option').innerText).toEqual('Apple');
});

test('should render results not found when no options match when autocomplete="automatic"', () => {
  render(
    <Combobox label="label" autocomplete="automatic">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireEvent.change(combobox, { target: { value: 'x' } });
  expect(screen.queryAllByRole('option').length).toEqual(0);
  expect(screen.queryByText('No results found.')).toBeTruthy();
});

test('should set selected value to active descendent when autocomplete="automatic" loses focus', () => {
  render(
    <Combobox label="label" autocomplete="automatic">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');
  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom so we fire the events directly on listbox
  const fireArrowDownKeyPress = () =>
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  fireArrowDownKeyPress();
  fireEvent.blur(combobox);
  expect(screen.getByRole('combobox')).toHaveDisplayValue('Banana');
});

test('should use id from props when set', () => {
  render(
    <Combobox label="label" id="this-is-a-combobox">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(document.querySelector('.Combobox')?.getAttribute('id')).toEqual(
    'this-is-a-combobox'
  );
});

test('should set selected value with "defaultValue" prop', () => {
  render(
    <Combobox label="label" defaultValue="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  expect(screen.getByRole('combobox')).toHaveDisplayValue('Banana');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  assertOptionIsSelected(1);
});

test('should not set multiple selected values with "defaultValue" prop', () => {
  render(
    <Combobox label="label" multiselect defaultValue={['Apple', 'Banana']}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  expect(screen.getByRole('combobox')).toHaveDisplayValue('');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  assertOptionsAreSelected(0, 1);
});

test('should set selected value with "value" prop', () => {
  render(
    <Combobox label="label" value="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  expect(screen.getByRole('combobox')).toHaveDisplayValue('Banana');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  assertOptionIsSelected(1);
});

test('should not set multiple selected values with "value" prop', () => {
  render(
    <Combobox label="label" multiselect value={['Apple', 'Banana']}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  const combobox = screen.getByRole('combobox');

  expect(screen.getByRole('combobox')).toHaveDisplayValue('');

  fireEvent.focus(combobox);
  assertListboxIsOpen(true);
  assertOptionsAreSelected(0, 1);
});

test('should not render hidden input when name is not provided', () => {
  render(
    <Combobox label="label" value="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(document.querySelector('input[type="hidden"]')).toBeFalsy();
});

test('should render hidden input with value from text contents of ComboboxOption', () => {
  render(
    <Combobox label="label" name="fruit" value="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(
    document.querySelector('input[type="hidden"]')?.getAttribute('value')
  ).toEqual('Banana');
});

test('should render multiple hidden inputs with value from text contents of ComboboxOption', () => {
  const value = ['Apple', 'Banana'];
  render(
    <Combobox label="label" name="fruit" multiselect value={value}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  document.querySelectorAll('input[type="hidden"]').forEach((input, idx) => {
    expect(input.getAttribute('value')).toEqual(value[idx]);
  });
});

test('should render hidden input with value from value from ComboboxOption', () => {
  render(
    <Combobox label="label" name="fruit" value="Banana">
      <ComboboxOption value="Apple">🍎</ComboboxOption>
      <ComboboxOption value="Banana">🍌</ComboboxOption>
      <ComboboxOption value="Cantaloupe">🍈</ComboboxOption>
    </Combobox>
  );

  expect(
    document.querySelector('input[type="hidden"]')?.getAttribute('value')
  ).toEqual('Banana');
});

test('should render multiple hidden inputs with value from value from ComboboxOption', () => {
  const value = ['Apple', 'Banana'];
  render(
    <Combobox label="label" name="fruit" multiselect value={value}>
      <ComboboxOption value="Apple">🍎</ComboboxOption>
      <ComboboxOption value="Banana">🍌</ComboboxOption>
      <ComboboxOption value="Cantaloupe">🍈</ComboboxOption>
    </Combobox>
  );

  document.querySelectorAll('input[type="hidden"]').forEach((input, idx) => {
    expect(input.getAttribute('value')).toEqual(value[idx]);
  });
});

test('should render hidden input with value from formValue from ComboboxOption', () => {
  render(
    <Combobox label="label" name="fruit" value="Banana">
      <ComboboxOption formValue="1">Apple</ComboboxOption>
      <ComboboxOption formValue="2">Banana</ComboboxOption>
      <ComboboxOption formValue="3">Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(
    document.querySelector('input[type="hidden"]')?.getAttribute('value')
  ).toEqual('2');
});

test('should render multiple hidden inputs with value from formValue from ComboboxOption', () => {
  const value = ['Apple', 'Banana'];
  const formValue = ['1', '2'];
  render(
    <Combobox label="label" name="fruit" multiselect value={value}>
      <ComboboxOption formValue="1">Apple</ComboboxOption>
      <ComboboxOption formValue="2">Banana</ComboboxOption>
      <ComboboxOption formValue="3">Cantaloupe</ComboboxOption>
    </Combobox>
  );

  document.querySelectorAll('input[type="hidden"]').forEach((input, idx) => {
    expect(input.getAttribute('value')).toEqual(formValue[idx]);
  });
});

test('should support portal element for combobox listbox', () => {
  const element = document.createElement('div');
  render(
    <Combobox label="label" portal={element}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(within(element).getByRole('listbox')).toBeTruthy();
});

test('should support portal element ref for combobox listbox', () => {
  const element = document.createElement('div');
  render(
    <Combobox label="label" portal={{ current: element }}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(
    element.contains(element.querySelector('[role="listbox"]'))
  ).toBeTruthy();
});

test('should have no axe violations when not expanded', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox label="label" ref={comboboxRef}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when expanded', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox label="label" ref={comboboxRef}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  fireEvent.focus(screen.getByRole('combobox'));

  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with active combobox item', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox label="label" ref={comboboxRef}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  fireEvent.focus(screen.getByRole('combobox'));
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });

  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with value and expanded', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox label="label" ref={comboboxRef} value="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  fireEvent.focus(screen.getByRole('combobox'));

  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with multiple values and expanded', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox
      label="label"
      ref={comboboxRef}
      multiselect
      value={['Apple', 'Banana']}
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  fireEvent.focus(screen.getByRole('combobox'));

  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with multiple values, disabled, and expanded', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox
      label="label"
      ref={comboboxRef}
      multiselect
      value={['Apple', 'Banana']}
      disabled
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  fireEvent.focus(screen.getByRole('combobox'));
  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with no matching results', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox label="label" ref={comboboxRef}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  fireEvent.focus(screen.getByRole('combobox'));
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'orange' }
  });

  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should render combobox with description', () => {
  render(
    <Combobox label="label" description="description">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(screen.getByText('description')).toBeInTheDocument();
});

test('should render combobox with error and description and aria-describedby', () => {
  const errorId = 'combo-error';
  const descriptionId = 'combo-description';
  render(
    <Combobox
      label="label"
      aria-describedby="other-id"
      required
      error="You forgot to choose a value."
      description="This is a description"
      id="combo"
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(screen.queryByText('You forgot to choose a value.')).toBeTruthy();
  expect(screen.queryByText('This is a description')).toBeTruthy();
  expect(screen.getByRole('combobox').getAttribute('aria-describedby')).toBe(
    `other-id ${descriptionId} ${errorId}`
  );
});

test('should associate field with description when no aria-describedby is set', () => {
  render(
    <Combobox label="label" description="This is a helpful description">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  expect(combobox).toHaveAccessibleDescription('This is a helpful description');
  expect(screen.getByText('This is a helpful description')).toBeInTheDocument();
});

test('should associate field with description when aria-describedby is set', () => {
  render(
    <Combobox
      label="label"
      description="This is a helpful description"
      aria-describedby="existing-id"
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  expect(combobox).toHaveAccessibleDescription('This is a helpful description');
  expect(screen.getByText('This is a helpful description')).toBeInTheDocument();

  // Check that aria-describedby includes both existing and new IDs
  const ariaDescribedby = combobox.getAttribute('aria-describedby');
  expect(ariaDescribedby).toContain('existing-id');
  expect(ariaDescribedby).toContain('description');
});

test('should handle description and error together', () => {
  render(
    <Combobox
      label="label"
      description="This is a helpful description"
      error="This field is required"
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  expect(combobox).toHaveAccessibleDescription(
    'This is a helpful description This field is required'
  );
});

test('should handle description, error, and aria-describedby together', () => {
  render(
    <Combobox
      label="label"
      description="This is a helpful description"
      error="This field is required"
      aria-describedby="existing-id"
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = screen.getByRole('combobox');
  expect(screen.getByText('This is a helpful description')).toBeInTheDocument();
  expect(screen.getByText('This field is required')).toBeInTheDocument();

  // Check that aria-describedby includes all IDs
  const ariaDescribedby = combobox.getAttribute('aria-describedby');
  expect(ariaDescribedby).toContain('existing-id');
  expect(ariaDescribedby).toContain('description');
  expect(ariaDescribedby).toContain('error');
});

test('should have no axe violations with description', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox
      label="label"
      description="This is a helpful description"
      ref={comboboxRef}
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with description and error', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox
      label="label"
      description="This is a helpful description"
      error="This field is required"
      ref={comboboxRef}
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with description, error, and aria-describedby', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox
      label="label"
      description="This is a helpful description"
      error="This field is required"
      aria-describedby="existing-id"
      ref={comboboxRef}
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with description when expanded', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox
      label="label"
      description="This is a helpful description"
      ref={comboboxRef}
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  fireEvent.focus(screen.getByRole('combobox'));

  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations with description and error when expanded', async () => {
  const comboboxRef = createRef<HTMLDivElement>();
  render(
    <Combobox
      label="label"
      description="This is a helpful description"
      error="This field is required"
      ref={comboboxRef}
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(comboboxRef.current).toBeTruthy();
  fireEvent.focus(screen.getByRole('combobox'));

  const results = await axe(comboboxRef.current!);
  expect(results).toHaveNoViolations();
});

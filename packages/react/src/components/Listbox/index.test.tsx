import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Listbox from './';
import { ListboxGroup, ListboxOption } from './';
import axe from '../../axe';

const assertListItemIsActive = (index: number) => {
  const activeOption = screen.getAllByRole('option')[index];
  expect(activeOption).toHaveClass('ListboxOption--active');
};

const assertListItemIsSelected = (index: number) => {
  expect(screen.getAllByRole('option')[index]).toHaveAttribute(
    'aria-selected',
    'true'
  );
};

const simulateKeypress = (key: string) => {
  switch (key) {
    case 'ArrowUp':
      fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowUp' });
      break;
    case 'ArrowDown':
      fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
      break;
    case 'Home':
      fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Home' });
      break;
    case 'End':
      fireEvent.keyDown(screen.getByRole('listbox'), { key: 'End' });
      break;
    default:
      break;
  }
};

test('should render listbox with options', () => {
  render(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Apple' })).toHaveTextContent(
    'Apple'
  );
  expect(screen.getByRole('option', { name: 'Banana' })).toHaveTextContent(
    'Banana'
  );
  expect(screen.getByRole('option', { name: 'Cantaloupe' })).toHaveTextContent(
    'Cantaloupe'
  );
});

test('should set "as" element for listbox', () => {
  render(
    <Listbox as="span">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(screen.getByRole('listbox').nodeName).toBe('SPAN');
});

test('should set "as" element for listbox option', () => {
  render(
    <Listbox>
      <ListboxOption as="span">Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(screen.getByRole('option', { name: 'Apple' }).nodeName).toBe('SPAN');
});

test('should render listbox with grouped options', () => {
  render(
    <Listbox>
      <ListboxGroup label="Fruit">
        <ListboxOption>Apple</ListboxOption>
        <ListboxOption>Banana</ListboxOption>
        <ListboxOption>Cantaloupe</ListboxOption>
      </ListboxGroup>
      <ListboxGroup label="Vegetables">
        <ListboxOption>Artichoke</ListboxOption>
        <ListboxOption>Broccoli</ListboxOption>
        <ListboxOption>Carrots</ListboxOption>
      </ListboxGroup>
    </Listbox>
  );

  const group1 = screen.getByLabelText('Fruit');
  const group2 = screen.getByLabelText('Vegetables');

  expect(group1).toBeInTheDocument();
  expect(group2).toBeInTheDocument();
  expect(group1.getAttribute('role')).toEqual('group');
  expect(group2.getAttribute('role')).toEqual('group');
  expect(group1.getAttribute('aria-labelledby')).toBeTruthy();
  expect(group2.getAttribute('aria-labelledby')).toBeTruthy();
  expect(group1.children[1]).toHaveTextContent('Apple');
  expect(group1.children[2]).toHaveTextContent('Banana');
  expect(group1.children[3]).toHaveTextContent('Cantaloupe');
  expect(group2.children[1]).toHaveTextContent('Artichoke');
  expect(group2.children[2]).toHaveTextContent('Broccoli');
  expect(group2.children[3]).toHaveTextContent('Carrots');
});

test('should use prop id for listbox group', () => {
  render(
    <Listbox>
      <ListboxGroup id="fruit" label="Fruit">
        <ListboxOption>Apple</ListboxOption>
        <ListboxOption>Banana</ListboxOption>
        <ListboxOption>Cantaloupe</ListboxOption>
      </ListboxGroup>
    </Listbox>
  );

  expect(screen.getByRole('group')).toHaveAccessibleName('Fruit');
  expect(screen.getByRole('presentation')).toHaveAttribute('id', 'fruit');
});

test('should set group label props', () => {
  render(
    <Listbox>
      <ListboxGroup
        label="Fruit"
        groupLabelProps={
          { 'data-value': 'true' } as React.HTMLAttributes<HTMLLIElement>
        }
      >
        <ListboxOption>Apple</ListboxOption>
        <ListboxOption>Banana</ListboxOption>
        <ListboxOption>Cantaloupe</ListboxOption>
      </ListboxGroup>
    </Listbox>
  );

  expect(screen.getByRole('presentation')).toHaveAttribute(
    'data-value',
    'true'
  );
});

test('should use prop id for listbox option', () => {
  render(
    <Listbox>
      <ListboxOption id="apple">Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
    'id',
    'apple'
  );
});

test('should set accessible name of grouped options', () => {
  render(
    <Listbox>
      <ListboxGroup label="Fruit">
        <ListboxOption>Apple</ListboxOption>
        <ListboxOption>Banana</ListboxOption>
        <ListboxOption>Cantaloupe</ListboxOption>
      </ListboxGroup>
    </Listbox>
  );

  expect(screen.getByRole('group')).toHaveAccessibleName('Fruit');
  expect(screen.getByRole('option', { name: 'Apple' })).toHaveAccessibleName(
    'Apple'
  );
  expect(screen.getByRole('option', { name: 'Banana' })).toHaveAccessibleName(
    'Banana'
  );
  expect(
    screen.getByRole('option', { name: 'Cantaloupe' })
  ).toHaveAccessibleName('Cantaloupe');
  expect(screen.getByRole('presentation')).toHaveAttribute('id');
  expect(screen.getByRole('group')).toHaveAttribute(
    'aria-labelledby',
    screen.getByRole('presentation').getAttribute('id')
  );
});

test('should set the first non-disabled option as active on focus', () => {
  render(
    <Listbox>
      <ListboxOption disabled>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));
  expect(screen.getByRole('option', { name: 'Banana' })).toHaveClass(
    'ListboxOption--active'
  );
  expect(screen.getByRole('listbox')).toHaveAttribute(
    'aria-activedescendant',
    screen.getByRole('option', { name: 'Banana' }).getAttribute('id')
  );
});

test('should set the first option as active on focus with focusDisabledOptions set to true', () => {
  render(
    <Listbox focusDisabledOptions>
      <ListboxOption disabled>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));
  expect(screen.getByRole('option', { name: 'Apple' })).toHaveClass(
    'ListboxOption--active'
  );
  expect(screen.getByRole('listbox')).toHaveAttribute(
    'aria-activedescendant',
    screen.getByRole('option', { name: 'Apple' }).getAttribute('id')
  );
});

test('should set the first non-disabled option as active on focus when the options have changed', () => {
  const { rerender } = render(
    <Listbox>
      <ListboxOption disabled>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  waitFor(() => {
    fireEvent.focus(screen.getByRole('listbox'));
    expect(screen.getByRole('listbox')).toHaveFocus();
  });

  rerender(
    <Listbox>
      <ListboxOption disabled>Dragon Fruit</ListboxOption>
      <ListboxOption>Elderberry</ListboxOption>
      <ListboxOption>Fig</ListboxOption>
    </Listbox>
  );

  waitFor(() => {
    fireEvent.focus(screen.getByRole('listbox'));
    expect(screen.getByRole('listbox')).toHaveFocus();
  });

  expect(screen.getByRole('option', { name: 'Elderberry' })).toHaveClass(
    'ListboxOption--active'
  );
  expect(screen.getByRole('listbox')).toHaveAttribute(
    'aria-activedescendant',
    screen.getByRole('option', { name: 'Elderberry' }).getAttribute('id')
  );
});

test('should focus the first enabled option when focusStrategy is "first"', () => {
  render(
    <Listbox focusStrategy="first">
      <ListboxOption disabled>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));
  expect(screen.getByRole('option', { name: 'Banana' })).toHaveClass(
    'ListboxOption--active'
  );
});

test('should focus the last enabled option when focusStrategy is "last"', () => {
  render(
    <Listbox focusStrategy="last">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption disabled>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));
  expect(screen.getByRole('option', { name: 'Cantaloupe' })).toHaveClass(
    'ListboxOption--active'
  );
});

test('should set selected value with "value" prop when listbox option only has text label', () => {
  render(
    <Listbox value="Banana">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
});

test('should set selected value with "defaultValue" prop when listbox option only has text label', () => {
  render(
    <Listbox defaultValue="Banana">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
});

test('should set selected value with "value" prop when listbox option uses value prop', () => {
  render(
    <Listbox value="b">
      <ListboxOption value="a">Apple</ListboxOption>
      <ListboxOption value="b">Banana</ListboxOption>
      <ListboxOption value="c">Cantaloupe</ListboxOption>
    </Listbox>
  );

  const selectedOption = screen.getByRole('option', { name: 'Banana' });
  expect(selectedOption).toHaveAttribute('aria-selected', 'true');
});

test('should not change selected value when listbox is controlled', () => {
  render(
    <Listbox value="b">
      <ListboxOption value="a">Apple</ListboxOption>
      <ListboxOption value="b">Banana</ListboxOption>
      <ListboxOption value="c">Cantaloupe</ListboxOption>
    </Listbox>
  );

  fireEvent.click(screen.getByRole('option', { name: 'Cantaloupe' }));

  expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
});

test('should change selected value when listbox is uncontrolled', () => {
  render(
    <Listbox defaultValue="b">
      <ListboxOption value="a">Apple</ListboxOption>
      <ListboxOption value="b">Banana</ListboxOption>
      <ListboxOption value="c">Cantaloupe</ListboxOption>
    </Listbox>
  );

  fireEvent.click(screen.getByRole('option', { name: 'Cantaloupe' }));

  expect(screen.getByRole('option', { name: 'Cantaloupe' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
});

test('should handle ↓ keypress', () => {
  render(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));

  simulateKeypress('ArrowDown');
  assertListItemIsActive(2);
  simulateKeypress('ArrowDown');
  assertListItemIsActive(3);
});

test('should handle ↑ keypress', () => {
  render(
    <Listbox defaultValue="Dragon Fruit">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));

  simulateKeypress('ArrowUp');
  assertListItemIsActive(2);
  simulateKeypress('ArrowUp');
  assertListItemIsActive(0);
});

test('should keep active element bound to first/last when navigation is set to "bound"', () => {
  render(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));

  const assertListItemIsActive = (index: number) => {
    const activeOption = screen.getAllByRole('option')[index];
    expect(activeOption).toHaveClass('ListboxOption--active');
  };

  simulateKeypress('ArrowUp');
  assertListItemIsActive(0);
  simulateKeypress('ArrowDown');
  simulateKeypress('ArrowDown');
  simulateKeypress('ArrowDown');
  assertListItemIsActive(3);
});

test('should cycle to first/last active element when navigation is set to "cycle"', () => {
  render(
    <Listbox navigation="cycle">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));

  simulateKeypress('ArrowDown');
  simulateKeypress('ArrowDown');
  simulateKeypress('ArrowDown');
  assertListItemIsActive(0);
  simulateKeypress('ArrowUp');
  assertListItemIsActive(3);
});

test('should handle <home> keypress', () => {
  render(
    <Listbox defaultValue="Dragon Fruit">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));

  simulateKeypress('Home');
  assertListItemIsActive(0);
});

test('should handle <end> keypress', () => {
  render(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));

  simulateKeypress('End');
  assertListItemIsActive(3);
});

test('should handle onActiveChange', () => {
  const handleActiveChange = jest.fn();

  render(
    <Listbox onActiveChange={handleActiveChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));

  fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
  expect(handleActiveChange).toHaveBeenCalledWith(
    expect.objectContaining({ value: 'Apple' })
  );

  fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
  expect(handleActiveChange).toHaveBeenCalledWith(
    expect.objectContaining({ value: 'Cantaloupe' })
  );

  fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
  expect(handleActiveChange).toHaveBeenCalledWith(
    expect.objectContaining({ value: 'Dragon Fruit' })
  );
});

test('should handle listbox selection with "enter" keypress', () => {
  const handleSelectionChange = jest.fn();

  render(
    <Listbox onSelectionChange={handleSelectionChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));

  fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
  fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });

  expect(handleSelectionChange).toHaveBeenCalledTimes(1);
  expect(handleSelectionChange).toHaveBeenCalledWith(
    expect.objectContaining({ value: 'Cantaloupe' })
  );
});

test('should handle listbox selection with "space" keypress', () => {
  const handleSelectionChange = jest.fn();

  render(
    <Listbox onSelectionChange={handleSelectionChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));
  fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
  fireEvent.keyDown(screen.getByRole('listbox'), { key: ' ' });

  expect(handleSelectionChange).toHaveBeenCalledTimes(1);
  expect(handleSelectionChange).toHaveBeenCalledWith(
    expect.objectContaining({ value: 'Cantaloupe' })
  );
});

test('should handle listboxoption selection with "enter" keypress', () => {
  const handleClick = jest.fn();

  render(
    <Listbox>
      <ListboxOption onClick={handleClick}>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = screen.getByRole('listbox');
  fireEvent.focus(listbox);

  expect(handleClick).toHaveBeenCalledTimes(0);
  fireEvent.keyDown(listbox, { key: 'Enter' });
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('should handle listboxoption selection with "space" keypress', async () => {
  const handleClick = jest.fn();

  render(
    <Listbox>
      <ListboxOption onClick={handleClick}>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = screen.getByRole('listbox');
  fireEvent.focus(listbox);

  expect(handleClick).toHaveBeenCalledTimes(0);
  fireEvent.keyDown(listbox, { key: ' ' });
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('should not prevent default event with non-navigational keypress', () => {
  const preventDefault = jest.fn();

  render(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.focus(screen.getByRole('listbox'));
  (fireEvent.keyDown(screen.getByRole('listbox')), { key: 'Tab' });
  expect(preventDefault).not.toHaveBeenCalled();

  (fireEvent.keyDown(screen.getByRole('listbox')), { key: 'Escape' });
  expect(preventDefault).not.toHaveBeenCalled();
});

test('should handle listbox selection with "click" event', () => {
  const onSelectionChange = jest.fn();

  render(
    <Listbox onSelectionChange={onSelectionChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  expect(onSelectionChange).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('option', { name: 'Cantaloupe' }));

  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  expect(onSelectionChange).toHaveBeenCalledWith(
    expect.objectContaining({ value: 'Cantaloupe' })
  );
});

test('should not invoke selection for disabled elements with "click" event', () => {
  const onSelectionChange = jest.fn();

  render(
    <Listbox onSelectionChange={onSelectionChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  fireEvent.click(screen.getByRole('option', { name: 'Banana' }));

  expect(onSelectionChange).not.toHaveBeenCalled();
});

test('should retain selected value when options changes with defaultValue', () => {
  const options = [
    <ListboxOption key="a" value="a">
      Apple
    </ListboxOption>,
    <ListboxOption key="b" value="b">
      Banana
    </ListboxOption>,
    <ListboxOption key="c" value="c">
      Cantaloupe
    </ListboxOption>
  ];

  const { rerender } = render(<Listbox defaultValue="b">{options}</Listbox>);

  fireEvent.click(screen.getByRole('option', { name: 'Cantaloupe' }));
  assertListItemIsSelected(2);

  rerender(
    <Listbox defaultValue="b">
      {[
        ...options,
        <ListboxOption key="d" value="d">
          Dragon Fruit
        </ListboxOption>
      ]}
    </Listbox>
  );

  assertListItemIsSelected(2);
});

test('should render multiselect listbox', () => {
  render(
    <Listbox multiselect>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(screen.getByRole('listbox')).toHaveAttribute(
    'aria-multiselectable',
    'true'
  );
});

test('should allow multiple selections in uncontrolled multiselect listbox', () => {
  render(
    <Listbox multiselect>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  fireEvent.click(screen.getByRole('option', { name: 'Apple' }));
  fireEvent.click(screen.getByRole('option', { name: 'Banana' }));

  expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  expect(screen.getByRole('option', { name: 'Cantaloupe' })).toHaveAttribute(
    'aria-selected',
    'false'
  );
});

test('should handle deselection in multiselect listbox', () => {
  render(
    <Listbox multiselect>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  const appleOption = screen.getByRole('option', { name: 'Apple' });

  // Select then deselect
  fireEvent.click(appleOption);
  expect(appleOption).toHaveAttribute('aria-selected', 'true');

  fireEvent.click(appleOption);
  expect(appleOption).toHaveAttribute('aria-selected', 'false');
});

test('should handle deselection selection with multiple selected options in multiselect listbox', () => {
  const handleSelectionChange = jest.fn();

  render(
    <Listbox
      multiselect
      onSelectionChange={handleSelectionChange}
      defaultValue={['Apple', 'Banana']}
    >
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  const listbox = screen.getByRole('listbox');
  fireEvent.focus(listbox);
  fireEvent.keyDown(listbox, { key: 'Enter' });

  // the most recently selected item should be the initial active one
  expect(handleSelectionChange).toHaveBeenCalledWith(
    expect.objectContaining({
      value: ['Apple'],
      previousValue: ['Apple', 'Banana']
    })
  );
  expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
    'aria-selected',
    'false'
  );
});

test('should handle controlled multiselect selection', () => {
  const handleSelectionChange = jest.fn();

  render(
    <Listbox
      multiselect
      value={['Apple', 'Banana']}
      onSelectionChange={handleSelectionChange}
    >
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
    'aria-selected',
    'true'
  );

  fireEvent.click(screen.getByRole('option', { name: 'Cantaloupe' }));

  expect(handleSelectionChange).toHaveBeenCalledWith(
    expect.objectContaining({
      value: ['Apple', 'Banana', 'Cantaloupe'],
      previousValue: ['Apple', 'Banana']
    })
  );
});

test('should set initial values with defaultValue in multiselect', () => {
  render(
    <Listbox multiselect defaultValue={['Apple', 'Banana']}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  assertListItemIsSelected(0);
  assertListItemIsSelected(1);
  expect(screen.getByRole('option', { name: 'Cantaloupe' })).toHaveAttribute(
    'aria-selected',
    'false'
  );
});

test('should handle keyboard selection in multiselect', () => {
  const handleSelectionChange = jest.fn();

  render(
    <Listbox multiselect onSelectionChange={handleSelectionChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  const listbox = screen.getByRole('listbox');
  fireEvent.focus(listbox);

  // Move to first item and select
  simulateKeypress('ArrowDown');
  fireEvent.keyDown(listbox, { key: 'Enter' });

  // Move to second item and select
  simulateKeypress('ArrowDown');
  fireEvent.keyDown(listbox, { key: ' ' });

  expect(handleSelectionChange).toHaveBeenCalledWith(
    expect.objectContaining({
      value: ['Banana', 'Cantaloupe'],
      previousValue: ['Banana']
    })
  );
  assertListItemIsSelected(1);
  assertListItemIsSelected(2);
});

test('should return no axe violations', async () => {
  const { container } = render(
    <>
      <div id="listbox-grouped-example">Colors and Numbers</div>
      <Listbox as="div" aria-labelledby="listbox-grouped-example" value="Red">
        <ListboxGroup label="Colors">
          <ListboxOption>Red</ListboxOption>
          <ListboxOption disabled>Green</ListboxOption>
          <ListboxOption>Blue</ListboxOption>
        </ListboxGroup>
        <ListboxGroup label="Numbers">
          <ListboxOption>One</ListboxOption>
          <ListboxOption>Two</ListboxOption>
          <ListboxOption>Three</ListboxOption>
        </ListboxGroup>
      </Listbox>
    </>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations with multiselect', async () => {
  const { container } = render(
    <>
      <div id="listbox-grouped-example">Colors and Numbers</div>
      <Listbox
        as="div"
        aria-labelledby="listbox-grouped-example"
        multiselect
        value={['Red', 'One']}
      >
        <ListboxGroup label="Colors">
          <ListboxOption>Red</ListboxOption>
          <ListboxOption disabled>Green</ListboxOption>
          <ListboxOption>Blue</ListboxOption>
        </ListboxGroup>
        <ListboxGroup label="Numbers">
          <ListboxOption>One</ListboxOption>
          <ListboxOption>Two</ListboxOption>
          <ListboxOption>Three</ListboxOption>
        </ListboxGroup>
      </Listbox>
    </>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

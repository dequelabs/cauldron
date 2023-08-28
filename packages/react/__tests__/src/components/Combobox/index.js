import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import {
  default as Combobox,
  ComboboxGroup,
  ComboboxOption
} from 'src/components/Combobox';

const simulateKeydown =
  (wrapper, key) =>
  (event = {}) => {
    wrapper.simulate('keydown', { key, ...event });
    wrapper.update();
  };

// Utility function for checking if the ComboboxListbox is currently open
const listboxIsOpen = (wrapper) => (isOpen) => {
  const Listbox = wrapper.find('ul[role="listbox"]');
  const input = wrapper.find('[role="combobox"]');
  expect(input.prop('aria-expanded')).toEqual(isOpen);
  if (isOpen) {
    expect(Listbox.prop('className')).toContain('Combobox__listbox--open');
  } else {
    expect(Listbox.prop('className')).not.toContain('Combobox__listbox--open');
  }
};

test('should render combobox with options', () => {
  const options = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Banana', label: 'Banana' },
    { value: 'Cantaloupe', label: 'Cantaloupe' }
  ];
  const wrapper = mount(<Combobox options={options} />);
  expect(wrapper.find(Combobox).exists()).toBeTruthy();
  expect(wrapper.find(ComboboxOption).at(0).text()).toEqual('Apple');
  expect(wrapper.find(ComboboxOption).at(1).text()).toEqual('Banana');
  expect(wrapper.find(ComboboxOption).at(2).text()).toEqual('Cantaloupe');
});

test('should render combobox with children', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(wrapper.find(Combobox).exists()).toBeTruthy();
  expect(wrapper.find(ComboboxOption).at(0).text()).toEqual('Apple');
  expect(wrapper.find(ComboboxOption).at(1).text()).toEqual('Banana');
  expect(wrapper.find(ComboboxOption).at(2).text()).toEqual('Cantaloupe');
});

test('should render combobox with groups', () => {
  const wrapper = mount(
    <Combobox>
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

  const group1 = wrapper.find(ComboboxGroup).at(0);
  const group2 = wrapper.find(ComboboxGroup).at(1);

  expect(wrapper.find(Combobox).exists()).toBeTruthy();
  expect(group1.exists()).toBeTruthy();
  expect(group2.exists()).toBeTruthy();
  expect(group1.find('ul').prop('role')).toEqual('group');
  expect(group2.find('ul').prop('role')).toEqual('group');
  expect(group1.find('ul').prop('aria-labelledby')).toBeTruthy();
  expect(group2.find('ul').prop('aria-labelledby')).toBeTruthy();
  expect(group1.find(ComboboxOption).at(0).text()).toEqual('Apple');
  expect(group1.find(ComboboxOption).at(1).text()).toEqual('Banana');
  expect(group1.find(ComboboxOption).at(2).text()).toEqual('Cantaloupe');
  expect(group2.find(ComboboxOption).at(0).text()).toEqual('Artichoke');
  expect(group2.find(ComboboxOption).at(1).text()).toEqual('Broccoli');
  expect(group2.find(ComboboxOption).at(2).text()).toEqual('Carrots');
});

test('should open combobox listbox on click', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('click');
  assertListboxIsOpen(true);
});

test('should open combobox listbox on focus', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('focus');
  assertListboxIsOpen(true);
});

test('should open combobox listbox on keypress', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('keydown', { key: 'ArrowDown' });
  assertListboxIsOpen(true);
});

test('should close combobox listbox on "esc" keypress', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('keydown', { key: 'ArrowDown' });
  wrapper.find('[role="combobox"]').simulate('keydown', { key: 'A' });
  assertListboxIsOpen(true);
  wrapper.find('[role="combobox"]').simulate('keydown', { key: 'Escape' });
  assertListboxIsOpen(false);
});

test('should close combobox listbox on "blur"', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('focus');
  assertListboxIsOpen(true);
  wrapper.find('[role="combobox"]').simulate('blur');
  assertListboxIsOpen(false);
});

test('should close combobox listbox when selecting option via click', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('focus');
  assertListboxIsOpen(true);
  wrapper.find('li[role="option"]').at(0).simulate('click');
  assertListboxIsOpen(false);
});

test('should not close combobox listbox when selecting option via keypress', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  assertListboxIsOpen(false);
  combobox.simulate('focus');
  assertListboxIsOpen(true);
  combobox.simulate('keydown', { key: 'ArrowDown' });
  combobox.simulate('keydown', { key: 'ArrowDown' });
  combobox.simulate('keydown', { key: 'Enter' });
  assertListboxIsOpen(true);
});

test.todo('should render all options when autocomplete="none"');

test.todo('should render matching options when autocomplete="manual"');

test.todo(
  'should render results not found when no options match when autocomplete="manual"'
);

test.todo('should render matching options when autocomplete="automatic"');

test.todo(
  'should render results not found when no options match when autocomplete="automatic"'
);

test.todo(
  'should set first active descendent when autocomplete="automatic" on open'
);

test.todo('should use id from props when set');

test.todo('should set selected value with "defaultValue" prop');

test.todo('should set selected value with "value" prop');

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

test.todo('should render combobox with groups');

test.todo('should open combobox listbox on click');

test.todo('should open combobox listbox on focus');

test.todo('should open combobox listbox on keypress');

test.todo('should close combobox listbox on "esc" keypress');

test.todo('should close combobox listbox on "blur"');

test.todo('should close combobox listbox when selecting option via click');

test.todo(
  'should not close combobox listbox when selecting option via keypress'
);

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

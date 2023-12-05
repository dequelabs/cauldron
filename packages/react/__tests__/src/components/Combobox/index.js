import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import {
  default as Combobox,
  ComboboxGroup,
  ComboboxOption
} from 'src/components/Combobox';

const simulateKeyDown =
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

// Utility function for checking for active element for the given Combobox Option of a Combobox component
const optionIsActive = (wrapper) => (index) => {
  const combobox = wrapper.find('input[role="combobox"]');
  const options = wrapper.find(
    '[role="listbox"] .ComboboxOption[role="option"]'
  );
  const activeOption = options.at(index);
  expect(combobox.prop('aria-activedescendant')).toBeTruthy();
  expect(combobox.prop('aria-activedescendant')).toEqual(
    activeOption.prop('id')
  );
  expect(activeOption.hasClass('ComboboxOption--active')).toBeTruthy();
  options.forEach(
    (option, index) =>
      index !== index &&
      expect(option.hasClass('ComboboxOption--active')).toBeFalsy()
  );
};

// Utility function for checking for active element for the given Combobox Option of a Combobox component
const optionIsSelected = (wrapper) => (index) => {
  const options = wrapper.find(
    '[role="listbox"] .ComboboxOption[role="option"]'
  );
  const selectedOption = options.at(index);
  expect(selectedOption.prop('aria-selected')).toEqual(true);
  options.forEach(
    (option, index) =>
      index !== index && expect(option.prop('aria-selected')).toEqual(false)
  );
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
  const wrapper = mount(<Combobox options={options} />);
  expect(wrapper.find(Combobox).exists()).toBeTruthy();
  expect(wrapper.find('.ComboboxOption__description').at(0).text()).toEqual(
    options[0].description
  );
  expect(wrapper.find('.ComboboxOption__description').at(1).text()).toEqual(
    options[1].description
  );
  expect(wrapper.find('.ComboboxOption__description').at(2).text()).toEqual(
    options[2].description
  );
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
  const wrapper = mount(<Combobox>{children}</Combobox>);
  expect(wrapper.find(Combobox).exists()).toBeTruthy();
  expect(wrapper.find('.ComboboxOption__description').at(0).text()).toEqual(
    options[0].description
  );
  expect(wrapper.find('.ComboboxOption__description').at(1).text()).toEqual(
    options[1].description
  );
  expect(wrapper.find('.ComboboxOption__description').at(2).text()).toEqual(
    options[2].description
  );
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

test('should render required combobox', () => {
  const wrapper = mount(
    <Combobox required>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(wrapper.find('[role="combobox"]').prop('required')).toEqual(true);
  expect(wrapper.find('.Field__required-text').exists()).toBeTruthy();
  expect(wrapper.find('.Field__required-text').text()).toEqual('Required');
});

test('should render combobox with error', () => {
  const errorId = 'combo-error';
  const wrapper = mount(
    <Combobox
      id="combo"
      aria-describedby="other-id"
      required
      error="You forgot to choose a value."
    >
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(wrapper.find(`#${errorId}`).exists()).toBeTruthy();
  expect(wrapper.find(`#${errorId}`).text()).toEqual(
    'You forgot to choose a value.'
  );
  expect(
    wrapper.find('input').getDOMNode().getAttribute('aria-describedby')
  ).toBe(`other-id ${errorId}`);
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

test('should focus combobox input on click', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  const onFocus = spy(
    wrapper.find('[role="combobox"]').getElement().ref.current,
    'focus'
  );
  expect(onFocus.notCalled).toBeTruthy();
  wrapper
    .find('[role="combobox"]')
    .simulate('click', { target: document.body });
  assertListboxIsOpen(true);
  expect(onFocus.calledOnce).toBeTruthy();
});

test('should allow an input ref to be passed to the combobox', () => {
  const inputRef = React.createRef();
  const wrapper = mount(
    <Combobox inputRef={inputRef}>
      <ComboboxOption>Apple</ComboboxOption>
    </Combobox>
  );

  expect(inputRef.current).toBeTruthy();
  expect(inputRef.current).toEqual(wrapper.find('input').getDOMNode());
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

test('should not open combobox listbox on "enter" keypress', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('keydown', { key: 'Enter' });
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

test('should prevent default on combobox listbox option via mousedown', () => {
  const preventDefault = spy();
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
  expect(preventDefault.notCalled).toBeTruthy();
  wrapper
    .find('li[role="option"]')
    .at(0)
    .simulate('mousedown', { preventDefault });
  expect(preventDefault.calledOnce).toBeTruthy();
});

test('should close combobox listbox when selecting option via keypress', () => {
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
  act(() => {
    // we need to manually fire active change for the listbox
    wrapper
      .find('Listbox')
      .props()
      .onActiveChange({
        element: {
          getAttribute: () => 'id'
        }
      });
  });
  combobox.simulate('keydown', { key: 'Enter' });
  assertListboxIsOpen(false);
});

test('should set aria-activedescendent for active combobox options', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');
  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom/enzyme so we fire the events directly on listbox
  const simulateArrowDownKeypress = simulateKeyDown(
    wrapper.find('ul[role="listbox"]'),
    'ArrowDown'
  );
  const assertOptionIsActive = optionIsActive(wrapper);

  expect(combobox.prop('aria-activedescendant')).toBeFalsy();
  combobox.simulate('focus');
  assertListboxIsOpen(true);
  simulateArrowDownKeypress();
  assertOptionIsActive(0);
  simulateArrowDownKeypress();
  assertOptionIsActive(1);
  simulateArrowDownKeypress();
  assertOptionIsActive(2);
});

test('should prevent default event on home/end keypress', () => {
  const preventDefault = spy();
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const combobox = wrapper.find('[role="combobox"]');
  expect(preventDefault.notCalled).toBeTruthy();
  combobox.simulate('keydown', { key: 'Home', preventDefault });
  expect(preventDefault.callCount).toEqual(1);
  combobox.simulate('keydown', { key: 'End', preventDefault });
  expect(preventDefault.callCount).toEqual(2);
  combobox.simulate('keydown', { key: 'ArrowDown', preventDefault });
  expect(preventDefault.callCount).toEqual(2);
});

test('should call onActiveChange when active option changes', () => {
  const onActiveChange = spy();
  const wrapper = mount(
    <Combobox onActiveChange={onActiveChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');
  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom/enzyme so we fire the events directly on listbox
  const simulateArrowDownKeypress = simulateKeyDown(
    wrapper.find('ul[role="listbox"]'),
    'ArrowDown'
  );

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  expect(onActiveChange.notCalled).toBeTruthy();
  simulateArrowDownKeypress();
  expect(onActiveChange.callCount).toEqual(1);
  expect(onActiveChange.getCall(0).firstArg.value).toEqual('Apple');
  simulateArrowDownKeypress();
  expect(onActiveChange.callCount).toEqual(2);
  expect(onActiveChange.getCall(1).firstArg.value).toEqual('Banana');
  simulateArrowDownKeypress();
  expect(onActiveChange.callCount).toEqual(3);
  expect(onActiveChange.getCall(2).firstArg.value).toEqual('Cantaloupe');
});

test('should set input value to empty string on open with selected option', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  wrapper.find('[role="option"]').at(1).simulate('click');
  combobox.simulate('blur');
  assertListboxIsOpen(false);
  combobox.simulate('focus');
  expect(wrapper.find('input[role="combobox"]').prop('value')).toEqual('');
});

test('should restore input value to selected value on close with selected option', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  wrapper.find('[role="option"]').at(1).simulate('click');
  combobox.simulate('blur');
  assertListboxIsOpen(false);
  combobox.simulate('focus');
  combobox.simulate('blur');
  expect(wrapper.find('input[role="combobox"]').prop('value')).toEqual(
    'Banana'
  );
});

test('should handle selection with "click" event', () => {
  const onSelectionChange = spy();
  const wrapper = mount(
    <Combobox onSelectionChange={onSelectionChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const assertOptionIsSelected = optionIsSelected(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  wrapper.find('[role="option"]').at(1).simulate('click');
  wrapper.update();
  expect(onSelectionChange.callCount).toEqual(1);
  expect(onSelectionChange.firstCall.firstArg.value).toEqual('Banana');
  assertOptionIsSelected(0);
  combobox.simulate('click');
  wrapper.find('[role="option"]').at(2).simulate('click');
  expect(onSelectionChange.secondCall.firstArg.value).toEqual('Cantaloupe');
  assertOptionIsSelected(0);
});

test('should handle selection with "enter" keydown event', () => {
  const onSelectionChange = spy();
  const wrapper = mount(
    <Combobox onSelectionChange={onSelectionChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const assertOptionIsSelected = optionIsSelected(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom/enzyme so we fire the events directly on listbox
  const simulateArrowDownKeypress = simulateKeyDown(
    wrapper.find('ul[role="listbox"]'),
    'ArrowDown'
  );
  const simulateEnterKeypress = simulateKeyDown(
    wrapper.find('ul[role="listbox"]'),
    'Enter'
  );

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  simulateArrowDownKeypress();
  simulateEnterKeypress();
  expect(onSelectionChange.callCount).toEqual(1);
  expect(onSelectionChange.firstCall.firstArg.value).toEqual('Apple');
  combobox.simulate('click');
  assertOptionIsSelected(0);
  simulateArrowDownKeypress();
  simulateEnterKeypress();
  expect(onSelectionChange.secondCall.firstArg.value).toEqual('Banana');
  combobox.simulate('click');
  assertOptionIsSelected(1);
  simulateArrowDownKeypress();
  simulateEnterKeypress();
});

test('should always render all options when autocomplete="none"', () => {
  const wrapper = mount(
    <Combobox autocomplete="none">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  combobox.simulate('change', { target: { value: 'a' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(3);
  combobox.simulate('change', { target: { value: 'ap' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(3);
  combobox.simulate('change', { target: { value: 'apple' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(3);
});

test('should render matching options when autocomplete="manual"', () => {
  const wrapper = mount(
    <Combobox autocomplete="manual">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  combobox.simulate('change', { target: { value: 'a' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(3);
  combobox.simulate('change', { target: { value: 'ap' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(1);
  expect(wrapper.find('.ComboboxOption[role="option"]').text()).toEqual(
    'Apple'
  );
});

test('should render results not found when no options match when autocomplete="manual"', () => {
  const wrapper = mount(
    <Combobox autocomplete="manual">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  combobox.simulate('change', { target: { value: 'x' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(0);
  expect(wrapper.find('.ComboboxListbox__empty').text()).toEqual(
    'No results found.'
  );
});

test('should render results not found render function when no options match when autocomplete="manual"', () => {
  const wrapper = mount(
    <Combobox
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

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  combobox.simulate('change', { target: { value: 'x' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(0);
  expect(wrapper.find('.no-results').text()).toEqual(
    'Yo, no results found here.'
  );
});

test('should render results not found render component when no options match when autocomplete="manual"', () => {
  const wrapper = mount(
    <Combobox
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

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  combobox.simulate('change', { target: { value: 'x' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(0);
  expect(wrapper.find('.no-results').text()).toEqual(
    'Yo, no results found here.'
  );
});

test('should render matching options when autocomplete="automatic"', () => {
  const wrapper = mount(
    <Combobox autocomplete="automatic">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  combobox.simulate('change', { target: { value: 'a' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(3);
  combobox.simulate('change', { target: { value: 'ap' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(1);
  expect(wrapper.find('.ComboboxOption[role="option"]').text()).toEqual(
    'Apple'
  );
});

test('should render results not found when no options match when autocomplete="automatic"', () => {
  const wrapper = mount(
    <Combobox autocomplete="automatic">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  combobox.simulate('change', { target: { value: 'x' } });
  wrapper.update();
  expect(wrapper.find('.ComboboxOption[role="option"]').length).toEqual(0);
  expect(wrapper.find('.ComboboxListbox__empty').text()).toEqual(
    'No results found.'
  );
});

test('should set selected value to active descendent when autocomplete="automatic" loses focus', () => {
  const wrapper = mount(
    <Combobox autocomplete="automatic">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');
  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom/enzyme so we fire the events directly on listbox
  const simulateArrowDownKeypress = simulateKeyDown(
    wrapper.find('ul[role="listbox"]'),
    'ArrowDown'
  );

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  // Note: first active item should already be "Apple", but since dispatchEvent is
  // used it's not triggered correctly in enzyme so we fire an initial event to
  // make the first value active
  simulateArrowDownKeypress();
  simulateArrowDownKeypress();
  combobox.simulate('blur');
  expect(wrapper.find('[role="combobox"]').prop('value')).toEqual('Banana');
});

test('should use id from props when set', () => {
  const wrapper = mount(
    <Combobox id="this-is-a-combobox">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(wrapper.find('.Combobox').prop('id')).toEqual('this-is-a-combobox');
});

test('should set selected value with "defaultValue" prop', () => {
  const wrapper = mount(
    <Combobox defaultValue="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');
  const assertOptionIsSelected = optionIsSelected(wrapper);

  expect(wrapper.find('input[role="combobox"]').prop('value')).toEqual(
    'Banana'
  );

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  assertOptionIsSelected(1);
});

test('should set selected value with "value" prop', () => {
  const wrapper = mount(
    <Combobox value="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');
  const assertOptionIsSelected = optionIsSelected(wrapper);

  expect(wrapper.find('input[role="combobox"]').prop('value')).toEqual(
    'Banana'
  );

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  assertOptionIsSelected(1);
});

test('should not render hidden input when name is not provided', () => {
  const wrapper = mount(
    <Combobox value="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(wrapper.find('input[type="hidden"]').exists()).toBeFalsy();
});

test('should render hidden input with value from text contents of ComboboxOption', () => {
  const wrapper = mount(
    <Combobox name="fruit" value="Banana">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(wrapper.find('input[type="hidden"]').prop('value')).toEqual('Banana');
});

test('should render hidden input with value from value from ComboboxOption', () => {
  const wrapper = mount(
    <Combobox name="fruit" value="Banana">
      <ComboboxOption value="Apple">🍎</ComboboxOption>
      <ComboboxOption value="Banana">🍌</ComboboxOption>
      <ComboboxOption value="Cantaloupe">🍈</ComboboxOption>
    </Combobox>
  );

  expect(wrapper.find('input[type="hidden"]').prop('value')).toEqual('Banana');
});

test('should render hidden input with value from formValue from ComboboxOption', () => {
  const wrapper = mount(
    <Combobox name="fruit" value="Banana">
      <ComboboxOption formValue="1">Apple</ComboboxOption>
      <ComboboxOption formValue="2">Banana</ComboboxOption>
      <ComboboxOption formValue="3">Cantaloupe</ComboboxOption>
    </Combobox>
  );

  expect(wrapper.find('input[type="hidden"]').prop('value')).toEqual('2');
});

test('should support portal element for combobox listbos', () => {
  const element = document.createElement('div');
  const wrapper = mount(
    <Combobox portal={element}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(wrapper.find('Portal').exists()).toBeTruthy();
  expect(element.querySelector('ul[role="listbox"]')).toBeTruthy();
});

test('should support portal element ref for combobox listbos', () => {
  const element = document.createElement('div');
  const wrapper = mount(
    <Combobox portal={{ current: element }}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(wrapper.find('Portal').exists()).toBeTruthy();
  expect(element.querySelector('ul[role="listbox"]')).toBeTruthy();
});

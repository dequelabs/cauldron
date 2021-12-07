import React, { useRef } from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import Select from 'src/components/Select';
import axe from '../../../axe';

const defaultProps = {
  name: 'Test Select',
  label: 'Test Select'
};
const withCustomOptions = (otherProps = {}) => {
  return mount(
    <div>
      <Select
        {...defaultProps}
        {...otherProps}
        defaultValue="Bill"
        options={[
          { key: '1', value: 'Fred' },
          { key: '2', value: 'Bill' },
          { key: '3', value: 'Ted' },
          { key: '4', value: 'Bob' }
        ]}
      />
    </div>
  );
};

test('renders the expected UI', () => {
  const wrapper = withCustomOptions();

  expect(wrapper.find('.Field__select--label')).toBeTruthy();
  expect(wrapper.find('.Field__select--required')).toBeTruthy();
  expect(wrapper.find('.Field__select')).toBeTruthy();
  expect(wrapper.find('.Field__option')).toBeTruthy();
  expect(wrapper.find('.Field__required-text').exists()).toBe(false);
  expect(wrapper.find('.Error').exists()).toBe(false);
});

test('sets option attributes properly', () => {
  const select = mount(
    <Select
      {...defaultProps}
      defaultValue="a"
      options={[
        { key: '1', value: 'a' },
        { disabled: true, key: '2', value: 'b' },
        { key: '3', value: 'c' }
      ]}
    />
  );
  const opts = select.find('option');
  expect(opts.length).toBe(3);
  const disabledOpt = select.find('[disabled]');
  expect(disabledOpt.text()).toBe('b');
});

test('passes ref properly', () => {
  const TestElement = () => {
    const selectRef = useRef(null);
    return (
      <>
        <Select
          {...defaultProps}
          id="test-id"
          ref={selectRef}
          defaultValue="a"
          options={[{ key: '1', value: 'a' }]}
        />
        <button
          id="test-button"
          onClick={() => {
            selectRef.current.focus();
          }}
        >
          Test
        </button>
      </>
    );
  };

  const mountedElement = mount(<TestElement />);
  mountedElement.find('#test-button').simulate('click');
  expect(document.activeElement.id).toBe('test-id');
});

test('passes children properly', () => {
  const select = mount(
    <Select {...defaultProps} defaultValue="a">
      <option>a</option>
      <option disabled>b</option>
      <option>c</option>
    </Select>
  );
  const opts = select.find('option');
  expect(opts.length).toBe(3);
  const disabledOpt = select.find('[disabled]');
  expect(disabledOpt.text()).toBe('b');
});

test('renders required text', () => {
  const selectWithDefaultRequiredText = withCustomOptions({ required: true });
  const selectWithCustomRequiredText = withCustomOptions({
    requiredText: 'Bananas',
    required: true
  });

  expect(
    selectWithDefaultRequiredText.find('.Field__required-text').text()
  ).toBe('Required');
  expect(
    selectWithCustomRequiredText.find('.Field__required-text').text()
  ).toBe('Bananas');
});

test('handles errors', () => {
  const errorText = 'ErR0r';
  const select = withCustomOptions({
    error: errorText
  });
  const error = select.find('.Error');

  expect(error.text()).toBe(errorText);
  expect(select.find('select').prop('aria-describedby')).toBe(error.prop('id'));
  expect(
    select.find('.Field__label--has-error').hasClass('Field__label--has-error')
  ).toBe(true);
  expect(
    select.find('.Field__select--wrapper').hasClass('Field--has-error')
  ).toBe(true);
});

test('should return no axe violations', async () => {
  const opts = [
    { key: '1', value: 'Bar' },
    { key: '2', value: 'Foo' },
    { key: '3', value: 'Far' },
    { key: '4', value: 'Fan' },
    { key: '5', value: 'Fun' }
  ];
  const select = mount(
    <div>
      <Select {...defaultProps} defaultValue="Bar" options={opts} />
    </div>
  );
  expect(await axe(select.html())).toHaveNoViolations();

  const disabledSelect = mount(
    <div>
      <Select {...defaultProps} disabled defaultValue="Bar" options={opts} />
    </div>
  );
  expect(await axe(disabledSelect.html())).toHaveNoViolations();

  const requiredSelect = mount(
    <div>
      <Select {...defaultProps} required defaultValue="Bar" options={opts} />
    </div>
  );
  expect(await axe(requiredSelect.html())).toHaveNoViolations();

  const errorSelect = mount(
    <div>
      <Select
        {...defaultProps}
        required
        error="Bananananas"
        defaultValue="Bar"
        options={opts}
      />
    </div>
  );
  expect(await axe(errorSelect.html())).toHaveNoViolations();
});

test('supports "controlled" select', () => {
  const select = mount(
    <Select
      {...defaultProps}
      value="Far"
      options={[
        { key: '1', value: 'Bar' },
        { key: '2', value: 'Foo' },
        { key: '3', value: 'Far' },
        { key: '4', value: 'Fan' },
        { key: '5', value: 'Fun' }
      ]}
    />
  );

  expect(select.find('select').getDOMNode().value).toBe('Far');

  select.setProps({
    value: 'Bar'
  });

  expect(select.find('select').getDOMNode().value).toBe('Bar');
});

test('fires onChange when change occurs', () => {
  const onChange = spy();
  const select = mount(
    <Select
      {...defaultProps}
      onChange={onChange}
      options={[
        { key: '1', value: 'Bar' },
        { key: '2', value: 'Foo' }
      ]}
    />
  );

  select.find('select').simulate('change');
  expect(onChange.called).toBe(true);
});

import React from 'react';
import { mount } from 'enzyme';
import Select from 'src/components/Select';
import axe from '../../../axe';

const defaultProps = {
  id: 'test-select',
  name: 'Test Select'
};
const withCustomOptions = (otherProps = {}) => {
  return mount(
    <div>
      <label htmlFor="test-select">Test Select</label>
      <Select
        {...defaultProps}
        {...otherProps}
        defaultValue="Bill"
        onChange={() => {}}
        options={[
          { value: 'Fred' },
          { value: 'Bill' },
          { value: 'Ted' },
          { value: 'Bob' }
        ]}
      />
    </div>
  );
};

test('renders the expected UI', () => {
  const wrapper = withCustomOptions();

  expect(wrapper.find('.Field__select')).toBeTruthy();
  expect(wrapper.find('.Field__option')).toBeTruthy();
});

test('sets option attributes properly', () => {
  const select = mount(
    <Select
      {...defaultProps}
      defaultValue="a"
      onChange={() => {}}
      options={[{ value: 'a' }, { disabled: true, value: 'b' }, { value: 'c' }]}
    />
  );
  const opts = select.find('option');
  expect(opts.length).toBe(3);
  const disabledOpt = select.find('[disabled]');
  expect(disabledOpt.text()).toBe('b');
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

test('should return no axe violations', async () => {
  const select = mount(
    <div>
      <label htmlFor="test-select">Test Select</label>
      <Select
        {...defaultProps}
        defaultValue="Bar"
        onChange={() => {}}
        options={[
          { value: 'Bar' },
          { value: 'Foo' },
          { value: 'Far' },
          { value: 'Fan' },
          { value: 'Fun' }
        ]}
      />
    </div>
  );
  expect(await axe(select.html())).toHaveNoViolations();
});

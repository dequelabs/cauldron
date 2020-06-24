import React from 'react';
import { mount } from 'enzyme';
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
        onChange={() => {}}
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
});

test('sets option attributes properly', () => {
  const select = mount(
    <Select
      {...defaultProps}
      defaultValue="a"
      onChange={() => {}}
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
      <Select
        {...defaultProps}
        defaultValue="Bar"
        onChange={() => {}}
        options={[
          { key: '1', value: 'Bar' },
          { key: '2', value: 'Foo' },
          { key: '3', value: 'Far' },
          { key: '4', value: 'Fan' },
          { key: '5', value: 'Fun' }
        ]}
      />
    </div>
  );
  expect(await axe(select.html())).toHaveNoViolations();
});

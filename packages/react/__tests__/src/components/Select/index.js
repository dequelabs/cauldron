import React from 'react';
import { mount } from 'enzyme';
import Select from 'src/components/Select';
import axe from '../../../axe';

const defaultProps = {
  id: 'test-select',
  name: 'Test Select'
};
const withDefaultSelected = (otherProps = {}) => {
  return mount(
    <div>
      <label htmlFor="test-select">Test Select</label>
      <Select
        {...defaultProps}
        {...otherProps}
        defaultValue="Bill"
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

// TODO: work on this when classes are added
test.skip('renders the expected UI', () => {
  const wrapper = withDefaultSelected();

  expect(wrapper.find('.Field').exists()).toBeTruthy();
  expect(wrapper.find('.Field__label')).toBeTruthy();
  expect(wrapper.find('.Field__listbox-button')).toBeTruthy();
  expect(wrapper.find('.Field__listbox')).toBeTruthy();
});

test('sets option attributes properly', () => {
  const select = mount(
    <Select
      {...defaultProps}
      value="a"
      options={[{ value: 'a' }, { disabled: true, value: 'b' }, { value: 'c' }]}
    />
  );
  const disabledOpt = select.find('[disabled]');
  expect(disabledOpt.text()).toBe('b');
});

test('should return no axe violations', async () => {
  const select = mount(
    <div>
      <label htmlFor="test-select">Test Select</label>
      <Select
        {...defaultProps}
        value="Bar"
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

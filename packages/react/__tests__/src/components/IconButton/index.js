import React from 'react';
import { shallow } from 'enzyme';
import IconButton from 'src/components/IconButton';
import axe from '../../../axe';

test('should render button', () => {
  const wrapper = shallow(<IconButton icon="pencil" label="Edit" />);
  expect(wrapper.find('button').exists()).toBe(true);
});

test('should return no axe violations', async () => {
  const wrapper = shallow(<IconButton icon="pencil" label="Edit" />);
  expect(await axe(wrapper.html())).toHaveNoViolations();
});

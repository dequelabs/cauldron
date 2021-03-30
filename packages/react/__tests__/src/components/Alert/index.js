import React from 'react';
import { mount } from 'enzyme';
import Alert from 'src/components/Alert';
import axe from '../../../axe';

const defaults = { show: false, heading: { text: 'hi' } };

test('returns null if passed a falsey "show" prop', () => {
  const alert = mount(<Alert {...defaults}>{'hello'}</Alert>);
  console.log(alert.debug())
  expect(alert.html()).toBe("");
});

test('shows modal if passed a truthy "show" prop', () => {
  const alert = mount(<Alert {...defaults} show={true}>{'hello'}</Alert>);
  expect(alert.find('.Alert').exists()).toBe(true)
});

test('should return no axe violations', async () => {
  const alert = mount(<Alert show={true} heading={'title'}>Hello!</Alert>);
  expect(await axe(alert.html())).toHaveNoViolations();
});
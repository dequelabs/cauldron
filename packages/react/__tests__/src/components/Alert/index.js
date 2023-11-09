import React from 'react';
import { mount } from 'enzyme';
import Alert from 'src/components/Alert';
import axe from '../../../axe';

const defaults = { show: false, heading: { text: 'hi' } };

test('returns null if passed a falsey "show" prop', () => {
  const alert = mount(<Alert {...defaults}>hello</Alert>);
  expect(alert.html()).toBe('');
});

test('shows modal if passed a truthy "show" prop', () => {
  const alert = mount(
    <Alert {...defaults} show>
      hello
    </Alert>
  );
  expect(alert.find('.Alert').exists()).toBe(true);
});

test('should return no axe violations', async () => {
  const alert = mount(
    <Alert show heading="title">
      Hello!
    </Alert>
  );
  expect(await axe(alert.html())).toHaveNoViolations();
});

test('should return no axe violations warning variant', async () => {
  const alert = mount(
    <Alert show variant="warning" heading="title">
      Hello!
    </Alert>
  );
  expect(await axe(alert.html())).toHaveNoViolations();
});

import React from 'react';
import { setImmediate } from 'timers/promises';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import Notice from 'src/components/Notice';
import axe from '../../../axe';

test('handles rendering without errors', done => {
  const wrapper = mount(<Notice />);
  expect(wrapper.find('.Notice').length).toBe(1);
  done();
});

test.only('should return correct data passed via prop', async () => {
  const wrapper = mount(
    <Notice type="info" title="foo">
      bar
    </Notice>
  );

  expect(wrapper.find('.Notice').length).toBe(1);
  expect(wrapper.prop('title')).toBe('foo');
  expect(wrapper.prop('type')).toBe('info');
  expect(wrapper.prop('children')).toBe('bar');
});

test('should return no axe violations', async () => {
  const wrapper = mount(
    <Notice type="info" title="foo">
      bar
    </Notice>
  );

  const violations = await axe(wrapper.html());
  expect(violations).toHaveNoViolations();
});

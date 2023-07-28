import React from 'react';
import { setImmediate } from 'timers/promises';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Notice from 'src/components/Notice';
import axe from '../../../axe';

test('handles rendering without errors', done => {
  const wrapper = mount(<Notice />);
  expect(wrapper.find('.Notice').length).toBe(1);
  done();
});

test('should return no axe violations', async () => {
  const confirmation = mount(
    <Notice type="info" {...otherProps}>
      hi
    </Notice>
  );

  const violations = await axe(confirmation.html());
  expect(violations).toHaveNoViolations();
});

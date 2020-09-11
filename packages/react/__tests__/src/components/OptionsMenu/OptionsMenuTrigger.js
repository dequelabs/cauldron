import React from 'react';
import { mount } from 'enzyme';
import Trigger from 'src/components/OptionsMenu/OptionsMenuTrigger';
import axe from '../../../axe';

test('should render children', () => {
  const child = 'hi';
  const trigger = mount(<Trigger>{child}</Trigger>);
  expect(trigger.find(child)).toBeTruthy();
});

test('should return no axe violations', async () => {
  const trigger = mount(<Trigger>Click me, I am a trigger!</Trigger>);
  expect(await axe(trigger.html())).toHaveNoViolations();
});

test('should set [aria-haspopup=true] on button', () => {
  const trigger = mount(<Trigger>/giphy bears</Trigger>);
  expect(trigger.getDOMNode().getAttribute('aria-haspopup')).toBe('true');
});

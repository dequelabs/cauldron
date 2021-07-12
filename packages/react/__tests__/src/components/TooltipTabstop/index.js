import React, { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import TooltipTabstop from 'src/components/TooltipTabstop';
import axe from '../../../axe';

const update = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();
  });
};

test('renders without blowing up', async () => {
  const wrapper = mount(<TooltipTabstop tooltip="World">Hello</TooltipTabstop>);
  await update(wrapper);
  expect(wrapper.find('TooltipTabstop').exists()).toBeTruthy();
});

test(' should return no axe violations', async () => {
  const wrapper = mount(<TooltipTabstop tooltip="World">Hello</TooltipTabstop>);
  await update(wrapper);
  expect(await axe(wrapper.html())).toHaveNoViolations();
});

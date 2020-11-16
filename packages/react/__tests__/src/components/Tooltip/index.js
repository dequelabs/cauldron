import React, { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Tooltip from 'src/components/Tooltip';
import axe from '../../../axe';

const update = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();
  });
};

// eslint-disable-next-line react/prop-types
const Wrapper = ({ buttonProps = {}, tooltipProps = {} }) => {
  const ref = useRef();
  return (
    <React.Fragment>
      <button ref={ref} {...buttonProps}>
        button
      </button>
      <Tooltip target={ref} {...tooltipProps} show>
        Hello Word
      </Tooltip>
    </React.Fragment>
  );
};

test('renders without blowing up', async () => {
  const wrapper = mount(<Wrapper />);
  await update(wrapper);
  expect(wrapper.find('Tooltip').exists()).toBeTruthy();
});

test('should auto-generate id', async () => {
  const wrapper = mount(<Wrapper />);
  await update(wrapper);
  const id = wrapper.find('.Tooltip').props().id;
  expect(id).toBeTruthy();
  expect(id).toEqual(
    wrapper
      .find('button')
      .getDOMNode()
      .getAttribute('aria-describedby')
  );
});

test('should not overwrite user provided id and aria-describedby', async () => {
  const buttonProps = { [`aria-describedby`]: 'foo tooltipid' };
  const tooltipProps = { id: 'tooltipid' };
  const props = { buttonProps, tooltipProps };
  const wrapper = mount(<Wrapper {...props} />);
  await update(wrapper);
  expect(wrapper.find('.Tooltip').props().id).toEqual('tooltipid');
  expect(
    wrapper
      .find('button')
      .getDOMNode()
      .getAttribute('aria-describedby')
  ).toEqual('foo tooltipid');
});

test('should return no axe violations', async () => {
  const wrapper = mount(<Wrapper />);
  await update(wrapper);
  expect(await axe(wrapper.html())).toHaveNoViolations();
});

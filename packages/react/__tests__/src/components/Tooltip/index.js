import React, { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Tooltip, { TooltipHead, TooltipContent } from 'src/components/Tooltip';
import axe from '../../../axe';

const update = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();
  });
};

const sleep = (ms = 100) => new Promise(r => setTimeout(r, ms));

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

const BigWrapper = () => {
  const buttonRef = useRef();
  return (
    <React.Fragment>
      <button ref={buttonRef}>button</button>
      <Tooltip target={buttonRef} show>
        <TooltipHead>Hello world</TooltipHead>
        <TooltipContent>
          <ul>
            <li>one</li>
            <li>two</li>
            <li>three</li>
          </ul>
        </TooltipContent>
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

test('should hide tooltip on escape keypress', async () => {
  const wrapper = mount(<Wrapper />);
  await update(wrapper);
  expect(wrapper.find('.Tooltip').exists).toBeTruthy();
  await act(async () => {
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Escape'
      })
    );
  });
  await update(wrapper);
  expect(wrapper.find('.Tooltip').exists()).toBeFalsy();
});

test('does not render an arrow given variant="big"', async () => {
  const wrapper = mount(<Wrapper tooltipProps={{ variant: 'big' }} />);
  await update(wrapper);
  expect(wrapper.find('.TooltipArrow').exists()).toBe(false);
});

test('should fire the "cauldron:tooltip:show" custom event when tooltip is shown', async () => {
  let fired = false;
  const onShow = () => {
    fired = true;
  };
  const wrapper = mount(<Wrapper />);
  const button = wrapper.find('button').getDOMNode();

  button.addEventListener('cauldron:tooltip:show', onShow);

  await update(wrapper);
  await act(async () => {
    const e = new Event('mouseenter', { bubbles: true });
    button.dispatchEvent(e);
  });
  await update(wrapper);
  button.removeEventListener('cauldron:tooltip:show', onShow);

  expect(fired).toBe(true);
});

test('should fire the "cauldron:tooltip:hide" custom event when tooltip is hidden', async () => {
  let fired = false;
  const onHide = () => (fired = true);
  const wrapper = mount(<Wrapper />);
  const button = wrapper.find('button').getDOMNode();

  button.addEventListener('cauldron:tooltip:hide', onHide);

  await update(wrapper);
  await act(async () => {
    const e = new Event('mouseleave', { bubbles: true });
    button.dispatchEvent(e);
  });
  await update(wrapper);
  await act(async () => {
    await sleep();
  });
  button.removeEventListener('cauldron:tooltip:hide', onHide);

  expect(fired).toBe(true);
});

test('should handle hovering the tooltip', async () => {
  const wrapper = mount(<Wrapper />);
  const button = wrapper.find('button').getDOMNode();

  await update(wrapper);
  // display the tooltip
  await act(async () => {
    const e = new Event('mouseenter', { bubbles: true });
    button.dispatchEvent(e);
  });
  const tooltip = wrapper.find('Tooltip').getDOMNode();
  // move mouse from trigger to tip
  await act(async () => {
    const triggerEvent = new Event('mouseleave', { bubbles: true });
    const tipEvent = new Event('mouseenter', { bubbles: true });
    button.dispatchEvent(triggerEvent);
    tooltip.dispatchEvent(tipEvent);
  });

  // wait for the tip hide delay
  await act(async () => {
    await sleep();
  });
  await update(wrapper);
  // confirm tooltip is still displayed
  expect(tooltip.isConnected).toBeTruthy();
  // mouseout of tip
  await act(async () => {
    const tipEvent = new Event('mouseleave', { bubbles: true });
    tooltip.dispatchEvent(tipEvent);
  });
  // wait for the tip hide delay
  await act(async () => {
    await sleep();
  });
  await update(wrapper);
  // confirm tooltip is now hidden
  expect(tooltip.isConnected).toBeFalsy();
});

test('variant="big" should return no axe violations', async () => {
  const wrapper = mount(<BigWrapper />);
  await update(wrapper);
  expect(await axe(wrapper.html())).toHaveNoViolations();
});

test('should return no axe violations', async () => {
  const wrapper = mount(<Wrapper />);
  await update(wrapper);
  expect(await axe(wrapper.html())).toHaveNoViolations();
});

import React, { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Popover from 'src/components/Popover';
import axe from '../../../axe';
import * as AriaIsolate from '../../../../src/utils/aria-isolate';

let wrapperNode;
let mountNode;

beforeEach(() => {
  wrapperNode = document.createElement('div');
  wrapperNode.innerHTML = `
    <button data-test>Click Me!</button>
    <div id="#mount"></div>
  `;
  document.body.appendChild(wrapperNode);
  mountNode = document.getElementById('mount');
});

afterEach(() => {
  document.body.innerHTML = '';
  wrapperNode = null;
  mountNode = null;
});

const update = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setImmediate(resolve));
    wrapper.update();
  });
};

// eslint-disable-next-line react/prop-types
const Wrapper = ({ buttonProps = {}, tooltipProps = {} }) => {
  const ref = useRef();
  const onClose = jest.fn();
  return (
    <React.Fragment>
      <button ref={ref} {...buttonProps}>
        button
      </button>
      <Popover target={ref} show onClose={onClose} {...tooltipProps}>
        Hello Word
      </Popover>
      <div data-test></div>
    </React.Fragment>
  );
};

const WrapperPopoverWithElements = () => {
  const ref = useRef();
  const onClose = jest.fn();
  return (
    <React.Fragment>
      <button ref={ref}>button</button>
      <Popover target={ref} show onClose={onClose}>
        <button data-test="foo1">Foo1</button>
        <button data-test="foo2">Foo2</button>
        <button data-test="foo3">Foo3</button>
      </Popover>
      <div data-test></div>
    </React.Fragment>
  );
};

// eslint-disable-next-line react/prop-types
const WrapperPrompt = ({ buttonProps = {}, tooltipProps = {} }) => {
  const ref = useRef();
  const onClose = jest.fn();
  return (
    <React.Fragment>
      <button ref={ref} {...buttonProps}>
        button
      </button>
      <Popover
        variant="prompt"
        target={ref}
        show
        onClose={onClose}
        infoText="popover"
        {...tooltipProps}
      />
    </React.Fragment>
  );
};

test('renders without blowing up', async () => {
  const wrapper = mount(<Wrapper />);
  await update(wrapper);
  expect(wrapper.find('.Popover').exists()).toBeTruthy();
});

test('should auto-generate id', async () => {
  const wrapper = mount(<Wrapper />);
  await update(wrapper);
  const id = wrapper.find('.Popover').props().id;
  expect(id).toBeTruthy();
  expect(id).toEqual(
    wrapper.find('button').getDOMNode().getAttribute('aria-controls')
  );
});

test('should attach attribute aria-expanded correctly based on shown state', async () => {
  const wrapper = mount(<Wrapper />);
  await update(wrapper);
  expect(
    wrapper.find('button').getDOMNode().getAttribute('aria-expanded')
  ).toBeTruthy();

  const shownStateFalsy = mount(<Wrapper tooltipProps={{ show: false }} />);

  expect(
    shownStateFalsy.find('button').getDOMNode().getAttribute('aria-expanded')
  ).toBeFalsy();
});

test('should support adding className to tooltip', async () => {
  const wrapper = mount(<Wrapper tooltipProps={{ className: 'foo' }} />);
  await update(wrapper);
  expect(wrapper.find('.Popover').hasClass('Popover')).toBeTruthy();
  expect(wrapper.find('.Popover').hasClass('foo')).toBeTruthy();
});

test('should not overwrite user provided id and aria-describedby', async () => {
  const buttonProps = { [`aria-describedby`]: 'foo popoverid' };
  const tooltipProps = { id: 'popoverid' };
  const props = { buttonProps, tooltipProps };
  const wrapper = mount(<Wrapper {...props} />);
  await update(wrapper);
  expect(wrapper.find('.Popover').props().id).toEqual('popoverid');
  expect(
    wrapper.find('button').getDOMNode().getAttribute('aria-describedby')
  ).toEqual('foo popoverid');
});

test('should call onClose on escape keypress', async () => {
  const onClose = jest.fn().mockImplementation(() => {});
  const wrapper = mount(<Wrapper tooltipProps={{ onClose }} />, {
    attachTo: mountNode
  });
  await update(wrapper);
  expect(wrapper.find('.Popover').exists).toBeTruthy();
  await act(async () => {
    document.body.dispatchEvent(
      new KeyboardEvent('keyup', {
        bubbles: true,
        key: 'Escape'
      })
    );
  });

  await update(wrapper);

  expect(onClose).toBeCalled();
});

test('should call onClose on clicking outside', async () => {
  const onClose = jest.fn().mockImplementation(() => {});
  mount(<Wrapper tooltipProps={{ onClose }} />, { attachTo: mountNode });

  await act(async () => {
    wrapperNode
      .querySelector('[data-test]')
      .dispatchEvent(new Event('click', { bubbles: true }));
  });

  expect(onClose).toBeCalled();
});

test('first element inside the popover container should have focus', async () => {
  const wrapper = mount(<WrapperPopoverWithElements />, {
    attachTo: mountNode
  });

  await update(wrapper);

  const firstInteractableElement = wrapper.find('[data-test="foo1"]');

  const focusedElement = document.activeElement;

  expect(firstInteractableElement.instance()).toBe(focusedElement);
});

test('should render two buttons (Apply/Close) for prompt variant', async () => {
  const wrapper = mount(<Wrapper tooltipProps={{ variant: 'prompt' }} />, {
    attachTo: mountNode
  });

  await update(wrapper);

  const closeBtn = wrapper.find('.Popover__close');
  const applyBtn = wrapper.find('.Popover__apply');

  expect(closeBtn.exists()).toBeTruthy();
  expect(applyBtn.exists()).toBeTruthy();
});

test('onClose should be called, when close button in prompt popover is clicked', async () => {
  const handleClose = jest.fn();

  const wrapper = mount(
    <WrapperPrompt
      tooltipProps={{ variant: 'prompt', onClose: handleClose }}
    />,
    { attachTo: mountNode }
  );

  await act(async () => {
    wrapper.find('button.Popover__close').simulate('click');
  });

  expect(handleClose).toHaveBeenCalled();
});

test('onApply should be called, when apply button in prompt popover is clicked', async () => {
  const applyFunc = jest.fn();

  const wrapper = mount(
    <WrapperPrompt tooltipProps={{ variant: 'prompt', onApply: applyFunc }} />,
    { attachTo: mountNode }
  );

  await act(async () => {
    wrapper.find('button.Popover__apply').simulate('click');
  });

  expect(applyFunc).toHaveBeenCalled();
});

test('text for apply/close buttons are rendered correct', async () => {
  const closeButtonText = 'Specific text to close popover';
  const applyButtonText = 'Specific text to apply popover';

  const wrapper = mount(
    <WrapperPrompt
      tooltipProps={{ variant: 'prompt', closeButtonText, applyButtonText }}
    />,
    { attachTo: mountNode }
  );

  await update(wrapper);

  const closeBtn = wrapper.find('button.Popover__close');

  const applyBtn = wrapper.find('button.Popover__apply');

  expect(closeBtn.text()).toBe(closeButtonText);
  expect(applyBtn.text()).toBe(applyButtonText);
});

test('variant="prompt" should return no axe violations', async () => {
  const wrapper = mount(<WrapperPrompt />);
  await update(wrapper);
  expect(await axe(wrapper.html())).toHaveNoViolations();
});

test('should return no axe violations', async () => {
  const wrapper = mount(<Wrapper />);
  await update(wrapper);
  expect(await axe(wrapper.html())).toHaveNoViolations();
});

test('should use parent-provided ref', () => {
  const parentRef = React.createRef();
  const ref = React.createRef();
  const onClose = jest.fn();
  const wrapper = mount(
    <Popover ref={parentRef} target={ref} show onClose={onClose}>
      Hello Word
    </Popover>
  );

  const componentNode = wrapper.getDOMNode();
  expect(parentRef.current).toBe(componentNode);
});

test('activates aria isolate on show', async () => {
  const parentRef = React.createRef();
  const ref = React.createRef();
  const onClose = jest.fn();

  const activateFn = jest.fn();
  const deactivateFn = jest.fn();

  jest.spyOn(AriaIsolate, 'default').mockImplementation(() => ({
    activate: activateFn,
    deactivate: deactivateFn
  }));

  mount(
    <Popover ref={parentRef} target={ref} show onClose={onClose}>
      Hello Word
    </Popover>
  );

  expect(activateFn).toBeCalled();
});

test('deactivates aria isolate on hide', async () => {
  const parentRef = React.createRef();
  const ref = React.createRef();
  const onClose = jest.fn();

  const activateFn = jest.fn();
  const deactivateFn = jest.fn();

  jest.spyOn(AriaIsolate, 'default').mockImplementation(() => ({
    activate: activateFn,
    deactivate: deactivateFn
  }));

  const wrapper = mount(
    <Popover ref={parentRef} target={ref} show onClose={onClose}>
      Hello Word
    </Popover>
  );

  expect(activateFn).toBeCalled();

  wrapper.setProps({ show: false });

  expect(deactivateFn).toBeCalled();
});

test('aria-labelledby is set correctly for prompt variant', async () => {
  const wrapper = mount(<WrapperPrompt />);
  await update(wrapper);

  const id = wrapper.find('.Popover').props().id;

  expect(`${id}-label`).toEqual(
    wrapper.find('.Popover').getDOMNode().getAttribute('aria-labelledby')
  );
});

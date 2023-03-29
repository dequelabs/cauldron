import React from 'react';
import { act } from 'react-dom/test-utils';
import { setImmediate } from 'timers/promises';
import { shallow, mount } from 'enzyme';
import { createSandbox } from 'sinon';
import Code from 'src/components/Code';
import axe from '../../../axe';

const sandbox = createSandbox();

class MockObserver {
  observe() {}
  disconnect() {}
}

let resizeObserverListener;

beforeEach(() => {
  document.body.innerHTML = '<div id="fixture"></div>';
  global.ResizeObserver = global.ResizeObserver || (() => null);
  sandbox.stub(global, 'ResizeObserver').callsFake(listener => {
    resizeObserverListener = listener;
    return {
      observe: sandbox.stub(),
      disconnect: sandbox.stub()
    };
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  resizeObserverListener = null;
  sandbox.restore();
});

test('should render a <code> block', () => {
  const code = shallow(
    <Code language="javascript">{`var some = "javascript"`}</Code>
  );
  expect(code.contains('code'));
});

test('should return no axe violations', async () => {
  const code = shallow(
    <Code language="javascript">{`var some = "javascript"`}</Code>
  );
  expect(await axe(code.html())).toHaveNoViolations();
});

test.only('should set tabIndex when element is scrollable', async () => {
  // Mock the specific state expected when the tab should be scrollable
  sandbox.stub(global.HTMLPreElement.prototype, 'clientWidth').value(123);
  sandbox.stub(global.HTMLPreElement.prototype, 'scrollWidth').value(456);

  const wrapper = mount(
    <Code language="javascript" scrollable>{`var some = "javascript"`}</Code>,
    { attachTo: document.getElementById('fixture') }
  );

  act(() => {
    resizeObserverListener();
  });

  wrapper.update();

  expect(wrapper.find('pre').prop('tabIndex')).toEqual(0);
});

test.only('should not set tabIndex when element is not scrollable', () => {
  // Mock the specific state expected when the tab should not be scrollable
  sandbox.stub(global.HTMLPreElement.prototype, 'clientWidth').value(123);
  sandbox.stub(global.HTMLPreElement.prototype, 'scrollWidth').value(123);

  const wrapper = mount(
    <Code language="javascript" scrollable>{`var some = "javascript"`}</Code>,
    { attachTo: document.getElementById('fixture') }
  );

  act(() => {
    resizeObserverListener();
  });

  wrapper.update();

  expect(wrapper.find('pre').prop('tabIndex')).toEqual(undefined);
});

import React, { useRef } from 'react';
import { setImmediate } from 'timers/promises';
import { mount } from 'enzyme';
import { createSandbox } from 'sinon';
import useIntersectionRef from 'src/utils/useIntersectionRef';

const sandbox = createSandbox();
const refElement = document.createElement('div');
const rawElement = document.createElement('div');

global.IntersectionObserver =
  global.IntersectionObserver ||
  function () {
    return {
      observe: () => {},
      disconnect: () => {}
    };
  };

const observe = sandbox.stub();
const disconnect = sandbox.stub();

const mockIntersectionObserver = sandbox.stub().returns({
  observe,
  disconnect
});

// eslint-disable-next-line react/display-name,react/prop-types
const ComponentUsingElementRef = ({ results = () => {}, ...args }) => {
  const ref = useRef(refElement);
  results(useIntersectionRef(ref, args));
  return <span></span>;
};

// eslint-disable-next-line react/display-name,react/prop-types
const ComponentUsingElement = ({ results = () => {}, ...args }) => {
  useIntersectionRef(rawElement, args);
  return <span></span>;
};

beforeEach(() => {
  sandbox
    .stub(global, 'IntersectionObserver')
    .callsFake(mockIntersectionObserver);
});

afterEach(() => {
  sandbox.restore();
  sandbox.resetHistory();
});

test('handles element refs', async () => {
  expect(observe.notCalled).toBeTruthy();
  expect(disconnect.notCalled).toBeTruthy();

  const wrapper = mount(<ComponentUsingElementRef />);

  await setImmediate();

  expect(observe.calledOnce).toBeTruthy();
  expect(disconnect.notCalled).toBeTruthy();
  expect(observe.firstCall.firstArg).toEqual(refElement);

  wrapper.unmount();

  await setImmediate();

  expect(observe.calledOnce).toBeTruthy();
  expect(disconnect.calledOnce).toBeTruthy();
});

test('handles element', async () => {
  expect(observe.notCalled).toBeTruthy();
  expect(disconnect.notCalled).toBeTruthy();

  const wrapper = mount(<ComponentUsingElement />);

  await setImmediate();

  expect(observe.calledOnce).toBeTruthy();
  expect(disconnect.notCalled).toBeTruthy();
  expect(observe.firstCall.firstArg).toEqual(refElement);

  wrapper.unmount();

  await setImmediate();

  expect(observe.calledOnce).toBeTruthy();
  expect(disconnect.calledOnce).toBeTruthy();
});

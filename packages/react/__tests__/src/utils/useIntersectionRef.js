import React, { useRef } from 'react';
import { setImmediate } from 'timers/promises';
import { mount } from 'enzyme';
import { createSandbox, spy } from 'sinon';
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
const ComponentUsingElementRef = ({ result = () => {}, args }) => {
  const ref = useRef(refElement);
  result(useIntersectionRef(ref, args));
  return <span></span>;
};

// eslint-disable-next-line react/display-name,react/prop-types
const ComponentUsingElement = ({ result = () => {}, args }) => {
  result(useIntersectionRef(rawElement, args));
  return <span></span>;
};

beforeEach(() => {
  // prevent console.warn in hook from getting invoked here
  sandbox.stub(console, 'warn').callsFake(() => {});
  sandbox
    .stub(global, 'IntersectionObserver')
    .callsFake(mockIntersectionObserver);
});

afterEach(() => {
  sandbox.restore();
  mockIntersectionObserver.resetHistory();
  observe.resetHistory();
  disconnect.resetHistory();
});

test('should handle element refs', async () => {
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

test('should handle element', async () => {
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

test('should not error with non element ref', () => {
  const Component = () => {
    const ref = useRef(null);
    useIntersectionRef(ref);
    return <span></span>;
  };
  expect(() => mount(<Component />)).not.toThrow();
});

test('should not error with non element', () => {
  const Component = () => {
    useIntersectionRef('banana');
    return <span></span>;
  };
  expect(() => mount(<Component />)).not.toThrow();
});

test('should return observer entry for element ref', async () => {
  const result = spy();
  const wrapper = mount(<ComponentUsingElementRef result={result} />);
  await setImmediate();

  expect(result.firstCall.firstArg.current).toEqual(null);
  mockIntersectionObserver.firstCall.firstArg([{ bananas: true }]);

  // Force a rerender
  wrapper.setProps();

  expect(result.secondCall.firstArg.current).toEqual({ bananas: true });
});

test('should return observer entry for element', async () => {
  const result = spy();
  const wrapper = mount(<ComponentUsingElement result={result} />);
  await setImmediate();

  expect(result.firstCall.firstArg.current).toEqual(null);
  mockIntersectionObserver.firstCall.firstArg([{ bananas: true }]);

  // Force a rerender
  wrapper.setProps();

  expect(result.secondCall.firstArg.current).toEqual({ bananas: true });
});

test('should pass intersection observer options', () => {
  mount(
    <ComponentUsingElement
      args={{ root: document.body, threshold: [0.0, 1.0] }}
    />
  );
  expect(mockIntersectionObserver.firstCall.lastArg.root).toEqual(
    document.body
  );
  expect(mockIntersectionObserver.firstCall.lastArg.threshold).toEqual([
    0.0, 1.0
  ]);
});

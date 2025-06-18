import React, { MutableRefObject, useRef } from 'react';
import { setImmediate } from 'timers/promises';
import { render } from '@testing-library/react';
import { createSandbox, spy } from 'sinon';
import useIntersectionRef from './useIntersectionRef';

const sandbox = createSandbox();
const refElement = document.createElement('div');

const noop = () => {
  // not empty
};

global.IntersectionObserver =
  global.IntersectionObserver ||
  function () {
    return {
      observe: noop,
      disconnect: noop
    };
  };

const observe = sandbox.stub();
const disconnect = sandbox.stub();

const mockIntersectionObserver = sandbox.stub().returns({
  observe,
  disconnect
});

// eslint-disable-next-line react/display-name,react/prop-types
const ComponentUsingElementRef = ({
  result = noop,
  args
}: {
  result?: (m: MutableRefObject<IntersectionObserverEntry | null>) => void;
  args?: any;
} = {}) => {
  const ref = useRef(refElement);
  result(useIntersectionRef(ref, args));
  return <span></span>;
};

beforeEach(() => {
  // prevent console.warn in hook from getting invoked here
  sandbox.stub(console, 'warn').callsFake(noop);
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

  const wrapper = render(<ComponentUsingElementRef />);
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
    useIntersectionRef(ref as unknown as MutableRefObject<HTMLElement>);
    return <span></span>;
  };
  expect(() => render(<Component />)).not.toThrow();
});

test('should return observer entry for element ref', async () => {
  const result = spy();
  const { rerender } = render(<ComponentUsingElementRef result={result} />);
  await setImmediate();

  expect(result.firstCall.firstArg.current).toEqual(null);
  mockIntersectionObserver.firstCall.firstArg([{ bananas: true }]);

  // Force a rerender
  rerender(<ComponentUsingElementRef result={result} />);

  expect(result.secondCall.firstArg.current).toEqual({ bananas: true });
});

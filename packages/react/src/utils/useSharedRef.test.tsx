import React from 'react';
import { render } from '@testing-library/react';
import { spy } from 'sinon';
import useSharedRef from './useSharedRef';

// eslint-disable-next-line react/display-name,react/prop-types
const ComponentWithSharedRef = React.forwardRef<
  HTMLSpanElement,
  { callback: (ref: React.RefObject<HTMLSpanElement>) => void }
>(({ callback }, ref) => {
  const sharedRef = useSharedRef(ref);
  callback(sharedRef);
  return <span ref={sharedRef}></span>;
});

test('it supports external functional refs', () => {
  let refEl: HTMLSpanElement | null = null;
  const internalRefCallback = spy();

  render(
    <ComponentWithSharedRef
      ref={(el) => (refEl = el)}
      callback={internalRefCallback}
    />
  );

  expect(refEl ? (refEl as HTMLSpanElement).tagName.toLowerCase() : '').toEqual(
    'span'
  );
  expect(
    internalRefCallback.firstCall.args[0].current?.tagName.toLowerCase()
  ).toEqual('span');
});

test('it supports mutable refs', () => {
  const fakeRef = { current: null };
  const internalRefCallback = spy();
  render(
    <ComponentWithSharedRef ref={fakeRef} callback={internalRefCallback} />
  );

  expect(
    fakeRef.current
      ? (fakeRef.current as HTMLSpanElement)?.tagName.toLowerCase()
      : ''
  ).toEqual('span');
  expect(
    internalRefCallback.firstCall.args[0].current?.tagName.toLowerCase()
  ).toEqual('span');
});

test('it supports undefined parent ref', () => {
  const internalRefCallback = spy();
  render(<ComponentWithSharedRef callback={internalRefCallback} />);
  expect(
    internalRefCallback.firstCall.args[0].current?.tagName.toLowerCase()
  ).toEqual('span');
});

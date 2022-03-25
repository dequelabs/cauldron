import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { spy } from 'sinon';
import useSharedRef from 'src/utils/useSharedRef';

// eslint-disable-next-line react/display-name,react/prop-types
const ComponentWithSharedRef = React.forwardRef(({ callback }, ref) => {
  const sharedRef = useSharedRef(ref);
  callback(sharedRef);
  return <span ref={sharedRef}></span>;
});

test('it supports external functional refs', () => {
  let refEl = null;
  const internalRefCallback = spy();
  act(() => {
    const wrapper = mount(
      <ComponentWithSharedRef
        ref={el => (refEl = el)}
        callback={internalRefCallback}
      />
    );
    wrapper.update();
  });
  expect(refEl?.tagName.toLowerCase()).toEqual('span');
  expect(
    internalRefCallback.firstCall.args[0].current?.tagName.toLowerCase()
  ).toEqual('span');
});

test('it supports mutable refs', () => {
  const fakeRef = { current: null };
  const internalRefCallback = spy();
  act(() => {
    const wrapper = mount(
      <ComponentWithSharedRef ref={fakeRef} callback={internalRefCallback} />
    );
    wrapper.update();
  });
  expect(fakeRef.current?.tagName.toLowerCase()).toEqual('span');
  expect(
    internalRefCallback.firstCall.args[0].current?.tagName.toLowerCase()
  ).toEqual('span');
});

test('it supports undefined parent ref', () => {
  const internalRefCallback = spy();
  act(() => {
    const wrapper = mount(
      <ComponentWithSharedRef callback={internalRefCallback} />
    );
    wrapper.update();
  });
  expect(
    internalRefCallback.firstCall.args[0].current?.tagName.toLowerCase()
  ).toEqual('span');
});

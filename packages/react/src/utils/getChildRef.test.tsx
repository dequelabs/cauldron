import React from 'react';
import { getChildRef } from './getChildRef';

test('getChildRef returns props.ref in React 19+', () => {
  const ref = React.createRef<HTMLDivElement>();
  const child = {
    type: 'div',
    props: { ref },
    key: null
  } as unknown as React.ReactElement;
  expect(getChildRef(child, '19.0.0')).toBe(ref);
});

test('getChildRef returns element.ref in React 16–18', () => {
  const ref = React.createRef<HTMLDivElement>();
  const child = {
    type: 'div',
    props: {},
    ref,
    key: null
  } as unknown as React.ReactElement;
  expect(getChildRef(child, '18.3.1')).toBe(ref);
});

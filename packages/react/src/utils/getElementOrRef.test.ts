import { createRef, type MutableRefObject } from 'react';
import getElementOrRef from './getElementOrRef';

test('should return element', () => {
  expect(getElementOrRef(document.body)).toBe(document.body);
});

test('should return ref element', () => {
  const ref = createRef() as MutableRefObject<HTMLElement>;
  ref.current = document.body;
  expect(getElementOrRef(ref)).toBe(document.body);
});

test('should return null when element is undefined', () => {
  expect(getElementOrRef(undefined)).toBe(null);
});

test('should return null when ref is undefined', () => {
  const ref = createRef() as MutableRefObject<HTMLElement>;
  expect(getElementOrRef(ref)).toBe(null);
});

test('should return null when element is not instance of Element', () => {
  // @ts-expect-error bad data
  expect(getElementOrRef('thing')).toBe(null);
});

test('should return null when ref is not instance of Element', () => {
  const ref = createRef() as MutableRefObject<HTMLElement>;
  // @ts-expect-error bad data
  ref.current = 'thing';
  expect(getElementOrRef(ref)).toBe(null);
});

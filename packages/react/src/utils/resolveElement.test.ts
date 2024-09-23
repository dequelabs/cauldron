import { createRef, type MutableRefObject } from 'react';
import { createSandbox } from 'sinon';
import resolveElement from './resolveElement';

const sandbox = createSandbox();

beforeEach(() => {
  // prevent console.warn in hook from getting invoked here
  sandbox.stub(console, 'warn').callsFake(() => null);
});

afterEach(() => {
  sandbox.restore();
});

test('should return element', () => {
  expect(resolveElement(document.body)).toBe(document.body);
});

test('should return ref element', () => {
  const ref = createRef() as MutableRefObject<HTMLElement>;
  ref.current = document.body;
  expect(resolveElement(ref)).toBe(document.body);
});

test('should return null when element is undefined', () => {
  expect(resolveElement(undefined)).toBe(null);
});

test('should return null when ref is undefined', () => {
  const ref = createRef() as MutableRefObject<HTMLElement>;
  expect(resolveElement(ref)).toBe(null);
});

test('should return null when element is not instance of Element', () => {
  // @ts-expect-error bad data
  expect(resolveElement('thing')).toBe(null);
});

test('should return null when ref is not instance of Element', () => {
  const ref = createRef() as MutableRefObject<HTMLElement>;
  // @ts-expect-error bad data
  ref.current = 'thing';
  expect(resolveElement(ref)).toBe(null);
});

import { default as idRefs, addIdRef, removeIdRef, hasIdRef } from './idRefs';

test('should provide id refs as a set', () => {
  const ids = idRefs('one two three one four five');
  expect(ids.size).toEqual(5);
  expect([...ids].join(' ')).toEqual('one two three four five');
});

test('should handle empty string', () => {
  const ids = idRefs('');
  expect(ids.size).toEqual(0);
});

test('should handle extra spaces', () => {
  const ids = idRefs('    one      two       ');
  expect(ids.size).toEqual(2);
  expect([...ids].join(' ')).toEqual('one two');
});

test('should add id ref', () => {
  expect(addIdRef('one two', 'three')).toEqual('one two three');
});

test('should not add existing id ref', () => {
  expect(addIdRef('one two three', 'two')).toEqual('one two three');
});

test('should remove id ref', () => {
  expect(removeIdRef('one two three', 'two')).toEqual('one three');
});

test('should return true when id ref contains id', () => {
  expect(hasIdRef('one two three', 'two')).toBeTruthy();
});

test('should return false when id ref does not contain id', () => {
  expect(hasIdRef('one three', 'two')).toBeFalsy();
});

test('should return false when id does not exactly match', () => {
  expect(hasIdRef('one two three', 'on')).toBeFalsy();
});

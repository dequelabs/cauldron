import interopDefault from './interopDefault';

test('should unwrap a double-wrapped CJS default export', () => {
  const value = () => 'called';

  expect(interopDefault({ __esModule: true, default: value })).toBe(value);
});

test('should unwrap a non-callable double-wrapped default', () => {
  const value = { registerLanguage: () => undefined };

  expect(interopDefault({ __esModule: true, default: value })).toBe(value);
});

test('should return a plain CJS export unchanged', () => {
  const fn = () => 'called';
  const object = { a: 1 };

  expect(interopDefault(fn)).toBe(fn);
  expect(interopDefault(object)).toBe(object);
});

test('should pass nullish input through', () => {
  expect(interopDefault(null)).toBeNull();
  expect(interopDefault(undefined)).toBeUndefined();
});

test('should not unwrap when __esModule is falsy', () => {
  const value = () => 'called';
  const wrapper = { __esModule: false, default: value };

  expect(interopDefault(wrapper)).toBe(wrapper);
});

// Pins current behavior for a dependency that sets `__esModule` but ships no
// `default`: there is nothing to unwrap, so callers get `undefined` and fail at
// their own call site (e.g. Code's module-scope `registerLanguage`) rather than
// here. Change this test deliberately if that should become a thrown error.
test('should return undefined when __esModule is set without a default', () => {
  expect(interopDefault({ __esModule: true })).toBeUndefined();
});

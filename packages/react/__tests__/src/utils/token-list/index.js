import tokenList from 'src/utils/token-list';

test('prevents duplicate tokens', () => {
  expect(tokenList('foo', 'foo bar baz')).toBe('foo bar baz');
});

test('adds the id to the end of the current value', () => {
  expect(tokenList('baz', 'foo bar')).toBe('foo bar baz');
});

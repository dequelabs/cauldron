import rndid from 'src/utils/rndid';

test('returns a unique string', () => {
  let hasDuplicates = false;
  const ids = new Set();

  for (let i = 0; i < 10000; i++) {
    const id = rndid();

    if (ids.has(id)) {
      hasDuplicates = true;
      break;
    }

    ids.add(id);
  }

  expect(hasDuplicates).toBeFalsy();
});

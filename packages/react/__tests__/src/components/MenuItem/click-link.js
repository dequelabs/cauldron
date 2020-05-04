import clickLink from 'src/components/MenuItem/click-link';

const fixture = document.createElement('div');
fixture.innerHTML = `
  <a id="link-one"></a>
  <a id="link-two"></a>
`;

document.body.appendChild(fixture);
const one = document.getElementById('link-one');
const two = document.getElementById('link-two');

test('clicks the first link within the target', () => {
  let firstCalled = false,
    secondCalled = false;
  const onFirstClick = () => (firstCalled = true);
  const onSecondClick = () => (secondCalled = true);

  one.addEventListener('click', onFirstClick);
  two.addEventListener('click', onSecondClick);

  clickLink(fixture, fixture);

  expect(firstCalled).toBeTruthy();
  expect(secondCalled).toBeFalsy();

  one.removeEventListener('click', onFirstClick);
  two.removeEventListener('click', onSecondClick);
});

test('does nothing if the target is an anchor', () => {
  let firstCalled = false,
    secondCalled = false;
  const onFirstClick = () => (firstCalled = true);
  const onSecondClick = () => (secondCalled = true);

  one.addEventListener('click', onFirstClick);
  two.addEventListener('click', onSecondClick);

  clickLink(one, one);

  expect(firstCalled).toBeFalsy();
  expect(secondCalled).toBeFalsy();

  one.removeEventListener('click', onFirstClick);
  two.removeEventListener('click', onSecondClick);
});

test('teardown', () => {
  document.body.innerHTML = '';
});

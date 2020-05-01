import AriaIsolate from '../../../../src/utils/aria-isolate/';

const { document } = window;
const div = document.createElement('div');
div.innerHTML = `
  <div id="one">hello worlds</div>
  <div id="parent"><div id="isolate-me"></div></div>
  <div id="already-hidden" aria-hidden="true"></div>
  <span id="two">Fred</span>
`;
document.body.innerHTML = '';
document.body.appendChild(div);
const target = document.getElementById('isolate-me');
const isolator = new AriaIsolate(target);

test('activate: isolates the target by applying aria-hidden="true" to expected nodes', () => {
  expect.assertions(4);
  isolator.activate();
  expect(isolator.affectedElements.length).toBe(2);
  expect(
    isolator.affectedElements.indexOf(document.getElementById('parent'))
  ).toBe(-1);
  expect(
    isolator.affectedElements.indexOf(document.getElementById('isolate-me'))
  ).toBe(-1);
  expect(
    isolator.affectedElements.indexOf(document.getElementById('already-hidden'))
  ).toBe(-1);
  // cleanup
  isolator.deactivate();
});

test('deactivate: properly removes aria-hidden from each of the affectedElements', () => {
  expect.assertions(2);

  isolator.activate();
  expect(isolator.affectedElements.length).toBe(2);

  isolator.deactivate();
  expect(div.querySelectorAll('[aria-hidden="true"]').length).toBe(1);
});

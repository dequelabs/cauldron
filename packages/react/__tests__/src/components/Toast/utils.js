import { tabIndexHandler } from 'src/components/Toast/utils';

let div, toast, targets;
const { document } = window;

beforeEach(() => {
  div = document.createElement('div');
  div.innerHTML = `
    <div class="toaster"></div>
    <div class="zero" tabindex="0"></div>
    <div class="minus-one" tabindex="-1"></div>
  `;

  document.body.appendChild(div);
  toast = div.querySelector('.toaster');
  targets = Array.from(div.querySelectorAll('.zero, .minus-one'));
});

afterEach(() => (document.body.innerHTML = ''));

test('reset: properly reverts tabIndex', () => {
  expect.assertions(2);

  // set cached tabindex values
  targets.forEach(target => {
    target.setAttribute('data-cached-tabindex', target.tabIndex);
    target.tabIndex = -1;
  });

  tabIndexHandler(true, toast);

  expect(targets[0].tabIndex).toBe(0);
  expect(targets[1].tabIndex).toBe(-1);
});

test('set: properly sets data-cached-tabindex/tabIndex', () => {
  tabIndexHandler(false, toast);
  expect(targets[0].tabIndex).toBe(-1);
  expect(targets[0].getAttribute('data-cached-tabindex')).toBe('0');
});

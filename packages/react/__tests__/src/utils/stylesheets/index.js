import {
  injectStyleTag,
  setStyle,
  removeStyleTag
} from 'src/utils/stylesheets';

afterEach(() => {
  document.head.innerHTML = '';
});

test('should inject style tag in head', () => {
  const tag = injectStyleTag();
  expect(document.head.querySelector('style')).toBe(tag);
});

test('should append cssString to style tag in head', () => {
  const cssString = `
    .foo {
      background: #000;
    }
  `;
  const tag = injectStyleTag();
  setStyle(tag, cssString);

  expect(tag.textContent).toBe(cssString);
});

test('remove style tag from head', () => {
  const tag = document.createElement('style');
  tag.textContent = '.foo { background: #000; }';
  document.head.appendChild(tag);

  removeStyleTag(tag);
  expect(document.head.querySelectorAll('style').length).toBe(0);
});

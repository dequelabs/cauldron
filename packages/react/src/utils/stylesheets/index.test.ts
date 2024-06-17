import { injectStyleTag, setStyle, removeStyleTag } from '../stylesheets';

const cssString = '.foo { background: #000;';

describe('Stylesheet Utilities', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  test('should inject style tag in head', () => {
    const tag = injectStyleTag();

    expect(document.head.querySelector('style')).toBe(tag);
  });

  test('should append cssString to style tag in head', () => {
    const tag = injectStyleTag();
    setStyle(tag, cssString);

    expect(tag).toHaveTextContent(cssString);
  });

  test('remove style tag from head', () => {
    const tag = injectStyleTag();
    setStyle(tag, cssString);
    removeStyleTag(tag);

    expect(document.head.querySelectorAll('style').length).toBe(0);
  });
});

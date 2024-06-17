function injectStyleTag(content?: string): HTMLStyleElement {
  const tag = document.createElement('style');

  if (content) {
    tag.textContent = content;
  }
  document.head.appendChild(tag);
  return tag;
}

describe('Stylesheet Utilities', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  test('should inject style tag in head', () => {
    const tag = injectStyleTag();
    expect(document.head.querySelector('style')).toBe(tag);
  });

  test('should append cssString to style tag in head', () => {
    const cssString = '.foo { background: #000; }';
    const tag = injectStyleTag(cssString);
    expect(tag).toHaveTextContent(cssString);
  });

  test('remove style tag from head', () => {
    const tag = injectStyleTag('.foo { background: #000; }');

    expect(tag).toBeInTheDocument();

    if (tag.parentNode) {
      tag.parentNode.removeChild(tag);
    }

    expect(document.head.querySelectorAll('style').length).toBe(0);
  });
});

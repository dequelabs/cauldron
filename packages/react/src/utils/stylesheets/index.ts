export const injectStyleTag = () => {
  const style = document.createElement('style');
  document.head.appendChild(style);
  return style;
};

export const setStyle = (tag: HTMLStyleElement, cssString: string) => {
  tag.textContent = cssString;
};

export const removeStyleTag = (tag: HTMLElement) => {
  document.head.removeChild(tag);
};

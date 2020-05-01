/**
 * Selector for NATURALLY focusable elements
 * @type {String}
 */
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'area[href]',
  'iframe',
  'object',
  'embed',
  '[tabindex="0"]',
  '[contenteditable]',
  'audio[controls]',
  'video[controls]'
].join(', ');

export default focusableSelector;

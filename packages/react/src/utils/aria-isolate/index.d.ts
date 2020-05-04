/**
 * Handles aria-hidden for dialogs.
 */
export default class AriaIsolate {
  private element;
  private affectedElements;
  constructor(el: HTMLElement);
  /**
   * applies aria-hidden to everything except direct parents of `this.element`
   */
  activate(): void;
  /**
   * restores aria-hidden state by removing aria-hidden="true"
   * from everything affected by 'activate'
   */
  deactivate(): void;
}

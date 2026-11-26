/**
 * Handles aria-hidden for dialogs.
 */
export default class AriaIsolate {
  private element: HTMLElement;
  private affectedElements: HTMLElement[];
  private getExcluded: () => Element[];

  /**
   * @param getExcluded elements to keep visible too, such as overlays
   *   portaled out of `el` that belong to it
   */
  constructor(el: HTMLElement, getExcluded: () => Element[] = () => []) {
    // eslint-disable-next-line ssr-friendly/no-dom-globals-in-constructor
    if (typeof HTMLElement === 'undefined' || !(el instanceof HTMLElement)) {
      throw new Error(
        'AriaIsolate must be instantiated with a valid HTML element'
      );
    }

    this.element = el;
    this.affectedElements = [];
    this.getExcluded = getExcluded;
  }

  /**
   * applies aria-hidden to everything except direct parents of `this.element`
   * and of the excluded elements
   */
  activate() {
    const visible = [this.element, ...this.getExcluded()];
    let parent = this.element.parentNode;

    while (parent && parent.nodeName !== 'HTML') {
      Array.prototype.slice
        .call(parent.children)
        .forEach((child: HTMLElement) => {
          if (!visible.some((element) => child.contains(element))) {
            if (child.getAttribute('aria-hidden') === 'true') {
              return;
            }

            this.affectedElements.push(child);
            child.setAttribute('aria-hidden', 'true');
          }
        });

      parent = parent.parentNode;
    }
  }

  /**
   * restores aria-hidden state by removing aria-hidden="true"
   * from everything affected by 'activate'
   */
  deactivate() {
    this.affectedElements.forEach((affected) =>
      affected.removeAttribute('aria-hidden')
    );
    this.affectedElements = [];
  }
}

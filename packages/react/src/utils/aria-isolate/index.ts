/**
 * Handles aria-hidden for dialogs.
 */
export default class AriaIsolate {
  private element: HTMLElement;
  private affectedElements: HTMLElement[];

  constructor(el: HTMLElement) {
    if (!(el instanceof HTMLElement)) {
      throw new Error(
        'AriaIsolate must be instantiated with a valid HTML element'
      );
    }

    this.element = el;
    this.affectedElements = [];
  }

  /**
   * applies aria-hidden to everything except direct parents of `this.element`
   */
  activate() {
    let parent = this.element.parentNode;

    while (parent && parent.nodeName !== 'HTML') {
      Array.prototype.slice
        .call(parent.children)
        .forEach((child: HTMLElement) => {
          if (child !== this.element && !child.contains(this.element)) {
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
    this.affectedElements.forEach(affected =>
      affected.removeAttribute('aria-hidden')
    );
    this.affectedElements = [];
  }
}

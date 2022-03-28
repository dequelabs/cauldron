import { isBrowser } from '../is-browser';

/**
 * A querySelectorAll that returns a normal array rather than live node list.
 *
 * @param  {String} selector
 * @param  {HTMLElement} context
 * @return {Array}
 */
const queryAll = (selector: string, context = document) => {
  if (!isBrowser()) {
    return [];
  }
  return Array.prototype.slice.call(context.querySelectorAll(selector));
};

export default queryAll;

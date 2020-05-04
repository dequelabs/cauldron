/**
 * A querySelectorAll that returns a normal array rather than live node list.
 *
 * @param  {String} selector
 * @param  {HTMLElement} context
 * @return {Array}
 */
declare const queryAll: (selector: string, context?: Document) => any;
export default queryAll;

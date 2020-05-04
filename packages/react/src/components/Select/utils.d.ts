/**
 * Determines if, based on input, we should "search" the options for the given character
 * @param  {Number} key     keyCode
 * @return {Boolean}
 */
export declare const shouldSearch: (key: number) => boolean;
/**
 * Searches options for matches based on characters typed ("starts-with" style searching)
 * @param  {String} key     the typed character
 * @param  {Array} options  the array of options in the given select
 * @return {Number}         the index of the item that should be "activated" based on input
 */
export declare const search: (key: string, options: any[]) => number;

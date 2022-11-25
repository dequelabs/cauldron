import { isBrowser } from '../is-browser';

/**
 * A utility to check whether a user has 'prefers-reduced-motion' enabled
 *
 * @return {Boolean}
 */
const prefersReducedMotion = (): Boolean => {
  const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');

  console.log(mediaQueryList.matches);

  if (!isBrowser()) {
    return false;
  }

  return mediaQueryList.matches;
};

export default prefersReducedMotion;

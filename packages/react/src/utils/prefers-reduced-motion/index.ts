import { isBrowser } from '../is-browser';

/**
 * A utility to check whether a user has 'prefers-reduced-motion' enabled
 *
 * @return {Boolean}
 */
const prefersReducedMotion = (): Boolean => {
  const reducedMotionEnabled =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!reducedMotionEnabled) {
    return true;
  }

  return reducedMotionEnabled.matches;
};

export default prefersReducedMotion;

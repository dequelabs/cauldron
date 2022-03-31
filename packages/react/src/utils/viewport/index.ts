import { MENU_BREAKPOINT } from '../../constants';
import { isBrowser } from '../is-browser';

export const isWide = () => {
  if (!isBrowser()) {
    return false;
  }
  return window.innerWidth >= MENU_BREAKPOINT;
};

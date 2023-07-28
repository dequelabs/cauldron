import focusableSelector from '../../utils/focusable-selector';
import queryAll from '../../utils/query-all';
import { IconType } from '../Icon';

interface TypeMap {
  [name: string]: {
    className: string;
    icon: IconType;
  };
}

/**
 * Maps toast types to their classNames and icons
 */
export const typeMap: TypeMap = {
  success: {
    className: 'success',
    icon: 'check-circle'
  },
  caution: {
    className: 'caution',
    icon: 'caution'
  },
  error: {
    className: 'danger',
    icon: 'caution'
  },
  info: {
    className: 'info',
    icon: 'info-circle-alt'
  }
};

export const tabIndexHandler = (reset: boolean, toast: HTMLElement | null) => {
  if (reset) {
    // restore tab indicies that we clobbered
    return queryAll('[data-cached-tabindex]').forEach((el: HTMLElement) => {
      el.tabIndex = Number(el.getAttribute('data-cached-tabindex'));
    });
  }

  queryAll(focusableSelector)
    .filter((el: HTMLElement) => !toast?.contains(el))
    .forEach((el: HTMLElement) => {
      el.setAttribute('data-cached-tabindex', el.tabIndex.toString());
      el.tabIndex = -1;
    });
};

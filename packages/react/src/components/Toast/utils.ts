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
  confirmation: {
    className: 'success',
    icon: 'info-circle'
  },
  caution: {
    className: 'warning',
    icon: 'caution'
  },
  'action-needed': {
    className: 'error',
    icon: 'no'
  },
  error: {
    className: 'error',
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

import focusableSelector from '../../utils/focusable-selector';
import queryAll from '../../utils/query-all';

/**
 * Maps toast types to their classNames and icons
 */
export const typeMap = {
  confirmation: {
    className: 'success',
    icon: 'fa-info-circle'
  },
  caution: {
    className: 'warning',
    icon: 'fa-warning'
  },
  'action-needed': {
    className: 'error',
    icon: 'fa-minus-circle'
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

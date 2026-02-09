import type { ElementOrRef } from '../types';
import { useEffect, useRef } from 'react';
import focusable from 'focusable';
import resolveElement from './resolveElement';

type FocusTrapMetadata = {
  targetElement: Element;
  lastFocusedElement: HTMLElement | null;
  suspended: boolean;
};

type FocusTrap = {
  initialFocusElement: HTMLElement | null;
  destroy: () => void;
} & FocusTrapMetadata;

// When multiple focus traps are created, we need to keep track of all previous traps
// in the stack and temporarily suspend any traps created before the most recent trap
const focusTrapStack: Array<FocusTrapMetadata> = [];
const removeFocusTrapFromStack = (focusTrap: FocusTrapMetadata): void => {
  const focusTrapIndex = focusTrapStack.findIndex(
    (trap) => focusTrap.targetElement === trap.targetElement
  );
  focusTrapStack.splice(focusTrapIndex, 1);
};

function getActiveElement(target: Element | null): HTMLElement {
  return (
    ((target?.ownerDocument.activeElement as HTMLElement) ??
      (document.activeElement as HTMLElement)) ||
    document.body
  );
}

function elementContains(
  containerElement: Element,
  targetElement: Element | null
): boolean {
  if (!targetElement) {
    return false;
  }

  if (containerElement.getRootNode() === targetElement.getRootNode()) {
    return containerElement.contains(targetElement);
  }

  let root = targetElement.getRootNode();
  while (root && root !== containerElement.getRootNode()) {
    if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // likely a shadow root, and we need to get the host
      root = (root as ShadowRoot).host;
    } else {
      break;
    }
  }
  return root && containerElement.contains(root);

  return false;
}

function createTrapGuard(): HTMLSpanElement {
  const trapGuard = document.createElement('span');
  trapGuard.setAttribute('tabindex', '0');
  trapGuard.setAttribute('aria-hidden', 'true');
  return trapGuard;
}

function createFocusTrap(
  targetElement: Element,
  initialFocusElement: HTMLElement | null
): FocusTrap {
  const startGuard = createTrapGuard();
  const endGuard = createTrapGuard();
  targetElement.insertAdjacentElement('beforebegin', startGuard);
  targetElement.insertAdjacentElement('afterend', endGuard);

  const focusTrapMetadata: FocusTrapMetadata = {
    targetElement,
    lastFocusedElement: null,
    suspended: false
  };

  const focusListener = (event: FocusEvent) => {
    const eventTarget = event.target;
    const elementContainsTarget = elementContains(
      targetElement,
      eventTarget as Element
    );

    if (focusTrapMetadata.suspended) {
      return;
    }

    if (!elementContainsTarget) {
      // If the event target element is not contained within the target element
      // for this focus trap, we need to prevent focus from escaping the container
      event.stopImmediatePropagation();
    } else if (eventTarget instanceof HTMLElement) {
      // Ensure we keep track of the most recent valid focus element if we
      // need to redirect focus later
      focusTrapMetadata.lastFocusedElement = eventTarget;
      return;
    }

    const focusableElements = Array.from(
      targetElement?.querySelectorAll(focusable) || []
    ) as HTMLElement[];

    // If focus reaches the trap guards, we need to wrap focus around to the leading
    // or trailing focusable element depending on which guard obtained focus
    if (focusableElements.length && eventTarget === startGuard) {
      focusableElements.reverse()[0]?.focus({ preventScroll: true });
      return;
    } else if (focusableElements.length && eventTarget === endGuard) {
      focusableElements[0]?.focus({ preventScroll: true });
      return;
    }

    // If focus somehow escaped the trap, we need to try to restore focus to
    // to a suitable focusable element within the focus trap target. Otherwise
    // we'll need to focus on an alternative within the container.
    if (elementContains(targetElement, focusTrapMetadata.lastFocusedElement)) {
      focusTrapMetadata.lastFocusedElement?.focus({ preventScroll: true });
    } else if (focusableElements.length) {
      focusableElements[0]?.focus({ preventScroll: true });
    } else {
      // if there are no focusable elements, just focus the container
      (targetElement as HTMLElement).focus({ preventScroll: true });
    }
  };

  document.addEventListener('focus', focusListener, true);

  if (focusTrapStack.length >= 1) {
    // Suspend any other traps in the stack while this one is active
    focusTrapStack.forEach((trap) => {
      trap.suspended = true;
    });
  }

  focusTrapStack.push(focusTrapMetadata);

  if (initialFocusElement) {
    initialFocusElement.focus({ preventScroll: true });
  } else {
    // Try to find a suitable focus element
    const focusableElements = Array.from(
      targetElement?.querySelectorAll(focusable) ||
        /* istanbul ignore else */ []
    ) as HTMLElement[];
    focusableElements[0]?.focus({ preventScroll: true });
  }

  return {
    ...focusTrapMetadata,
    initialFocusElement,
    destroy: () => {
      document.removeEventListener('focus', focusListener, true);
      removeFocusTrapFromStack(focusTrapMetadata);
      startGuard.parentNode?.removeChild(startGuard);
      endGuard.parentNode?.removeChild(endGuard);
      // If there are any remaining focus traps in the stack, we need
      // to unsuspend the most recently added focus trap
      if (focusTrapStack.length) {
        focusTrapStack[focusTrapStack.length - 1].suspended = false;
      }
    }
  };
}

export default function useFocusTrap<
  TargetElement extends Element = Element,
  FocusElement extends HTMLElement = HTMLElement
>(
  target: ElementOrRef<TargetElement>,
  options: {
    /**
     * When set to false, deactivates the focus trap. This can be necessary if
     * a component needs to conditionally manage focus traps.
     */
    disabled?: boolean;
    /**
     * When the trap is activated, an optional custom element or ref
     * can be provided to override the default initial focus element behavior.
     */
    initialFocusElement?: ElementOrRef<FocusElement>;
    /**
     * When set to true and the trap is deactivated, this will return focus
     * back to the original active element or the return focus element if
     * provided.
     */
    returnFocus?: boolean;
    /**
     * When the trap is deactivated, an optional custom element or ref
     * can be provided to override the default active element behavior.
     */
    returnFocusElement?: ElementOrRef<FocusElement>;
  } = {}
): React.RefObject<Readonly<FocusTrap>> {
  const {
    disabled = false,
    returnFocus = true,
    initialFocusElement: initialFocusElementOrRef,
    returnFocusElement
  } = options;
  const focusTrap = useRef<FocusTrap | null>(null);
  const returnFocusElementRef =
    useRef<HTMLElement>() as React.MutableRefObject<HTMLElement | null>;

  function restoreFocusToReturnFocusElement() {
    const resolvedReturnFocusElement = resolveElement(returnFocusElement);
    if (resolvedReturnFocusElement instanceof HTMLElement) {
      resolvedReturnFocusElement.focus();
    } else {
      returnFocusElementRef.current?.focus();
      returnFocusElementRef.current = null;
    }
  }

  useEffect(() => {
    const targetElement = resolveElement(target);
    const initialFocusElement = resolveElement<HTMLElement>(
      initialFocusElementOrRef
    );

    if (!targetElement || disabled) {
      return;
    }

    returnFocusElementRef.current = getActiveElement(targetElement);

    focusTrap.current = createFocusTrap(targetElement, initialFocusElement);

    return () => {
      focusTrap.current?.destroy();
      focusTrap.current = null;
      // istanbul ignore else
      if (returnFocus) {
        restoreFocusToReturnFocusElement();
      }
    };
  }, [target, disabled]);

  return focusTrap;
}

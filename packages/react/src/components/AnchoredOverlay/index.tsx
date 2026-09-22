import { autoUpdate, type Placement, type Coords } from '@floating-ui/dom';
import React, { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  useFloating,
  offset as offsetMiddleware,
  flip as flipMiddleware,
  autoPlacement as autoPlacementMiddleware,
  shift as shiftMiddleware,
  detectOverflow,
  type Middleware
} from '@floating-ui/react-dom';
import { type PolymorphicProps } from '../../utils/polymorphicComponent';
import resolveElement from '../../utils/resolveElement';
import useSharedRef from '../../utils/useSharedRef';
import useEscapeKey from '../../utils/useEscapeKey';
import useFocusTrap from '../../utils/useFocusTrap';
import { isBrowser } from '../../utils/is-browser';

type AnchoredOverlayProps<
  Overlay extends HTMLElement,
  Target extends HTMLElement
> = {
  /** A target element or ref to attach the overlay anchor element. */
  target:
    | Target
    | React.MutableRefObject<Target | null>
    | React.RefObject<Target | null>;
  /** Positional placement value to anchor the overlay element relative to its anchored target. */
  placement?: Placement | 'auto' | 'auto-start' | 'auto-end';
  /** Determines if the overlay anchor is currently visible. */
  open?: boolean;
  /** A callback function that is called when the overlay state changes. */
  onOpenChange?: (open: boolean) => void;
  /** A callback function that is called when the placement of the overlay changes. */
  onPlacementChange?: (placement: Placement) => void;
  /** A callback function that is called when the shift of the overlay changes. */
  onShiftChange?: (coords: Coords) => void;
  /** An optional offset number to position the anchor element from its anchored target. */
  offset?: number;
  /** When set, traps focus within the AnchoredOverlay. */
  focusTrap?: boolean;
  /** When `focusTrap` is true, optional arguments to configure the focus trap. */
  focusTrapOptions?: Parameters<typeof useFocusTrap>[1];
  /** Render the anchored overlay in a different location in the dom. */
  portal?: React.RefObject<HTMLElement | null> | HTMLElement;
  children?: React.ReactNode;
} & PolymorphicProps<React.HTMLAttributes<Overlay>>;

function getAutoAlignment(
  placement: 'auto' | 'auto-start' | 'auto-end'
): 'start' | 'end' | null {
  switch (placement) {
    case 'auto-start':
      return 'start';
    case 'auto-end':
      return 'end';
    default:
      return null;
  }
}

/**
 * Prevents large overlays from shifting off-screen above the viewport. When an overlay
 * would overflow past the top edge, this middleware signals that it should flip to an
 * alternative placement to keep content visible and accessible.
 */
const preventTopOverflowMiddleware: Middleware = {
  name: 'preventTopOverflow',
  async fn(state) {
    const overflow = await detectOverflow(state, {
      rootBoundary: 'document'
    });

    if (overflow?.top >= 0) {
      return {
        reset: {
          // Replace the initial placement axis with 'bottom' while preserving alignment (start/end)
          // Examples: 'top' -> 'bottom', 'top-start' -> 'bottom-start'
          placement: (state.placement.replace(
            /\w+?(-(start|end))?$/i,
            'bottom$1'
          ) || 'bottom') as Placement
        }
      };
    }

    return {};
  }
};

// Element-resize tracking is split out of `whileElementsMounted` so it can be
// scoped to the open state. This function's identity must stay stable:
// floating-ui keys its positioning effect on whether one was passed, and a
// re-run calls `update()` again, which on close pulls focus back out of the
// trigger.
const autoUpdateWithoutElementResize: typeof autoUpdate = (
  reference,
  floating,
  update
) => autoUpdate(reference, floating, update, { elementResize: false });

const AnchoredOverlay = forwardRef(
  <
    Overlay extends HTMLElement = HTMLElement,
    Target extends HTMLElement = HTMLElement
  >(
    {
      as,
      placement: initialPlacement = 'auto',
      target,
      children,
      style,
      open = false,
      offset,
      focusTrap,
      focusTrapOptions,
      onOpenChange,
      onPlacementChange,
      onShiftChange,
      portal,
      ...props
    }: AnchoredOverlayProps<Overlay, Target>,
    refProp: React.Ref<Overlay>
  ) => {
    const ref = useSharedRef<HTMLElement | null>(refProp);
    const Component = as || 'div';

    const {
      refs,
      floatingStyles,
      placement,
      middlewareData,
      update,
      elements
    } = useFloating({
      open,
      // default to initial placement on top when placement is auto
      // @ts-expect-error auto placement is not a valid placement for floating-ui
      placement: initialPlacement.startsWith('auto') ? 'top' : initialPlacement,
      middleware: [
        offsetMiddleware(offset ?? 0),
        initialPlacement.startsWith('auto')
          ? autoPlacementMiddleware({
              alignment: getAutoAlignment(initialPlacement as 'auto')
            })
          : flipMiddleware({
              fallbackAxisSideDirection: 'start'
            }),
        shiftMiddleware({
          crossAxis: false,
          boundary: 'clippingAncestors'
        }),
        preventTopOverflowMiddleware
      ].filter(Boolean),
      elements: {
        reference: resolveElement(target)
      },
      whileElementsMounted: autoUpdateWithoutElementResize
    });

    // Observing the target while the overlay is closed measures it for the
    // first time mid-layout, which leaves a ResizeObserver notification
    // undelivered and has the browser report an uncaught error.
    useEffect(() => {
      const { reference, floating } = elements;

      if (
        !open ||
        !reference ||
        !floating ||
        typeof ResizeObserver !== 'function'
      ) {
        return;
      }

      // Deferred a task: starting it re-positions, and a render in the middle
      // of the open sequence loses the overlay's initial focus target.
      let stopObserving: (() => void) | undefined;
      const timeout = setTimeout(() => {
        stopObserving = autoUpdate(reference, floating, update, {
          ancestorScroll: false,
          ancestorResize: false,
          layoutShift: false,
          elementResize: true
        });
      });

      return () => {
        clearTimeout(timeout);
        stopObserving?.();
      };
    }, [open, elements, update]);

    useEscapeKey({
      active: open,
      capture: true,
      defaultPrevented: true,
      callback: (event: KeyboardEvent) => {
        // when an anchored overlay is open, we want to prevent other potential "escape"
        // keypress events, like the closing of modals from occurring
        event.preventDefault();
        // istanbul ignore else
        if (typeof onOpenChange === 'function') {
          onOpenChange(!open);
        }
      }
    });

    useFocusTrap(ref, !focusTrap ? { disabled: true } : focusTrapOptions);

    useEffect(() => {
      if (typeof onPlacementChange === 'function') {
        onPlacementChange(placement);
      }
    }, [onPlacementChange, placement]);

    useEffect(() => {
      if (typeof onShiftChange === 'function') {
        onShiftChange({
          x: middlewareData.shift?.x || 0,
          y: middlewareData.shift?.y || 0
        });
      }
    }, [onShiftChange, middlewareData.shift?.x, middlewareData.shift?.y]);

    const AnchoredOverlayComponent = (
      <Component
        ref={(element: HTMLElement) => {
          refs.setFloating(element);
          ref.current = element;
        }}
        {...props}
        style={{ ...floatingStyles, ...style }}
      >
        {children}
      </Component>
    );

    if (portal && !isBrowser()) {
      return null;
    }

    if (portal && typeof portal !== 'undefined') {
      const portalElement =
        (portal && 'current' in portal ? portal.current : portal) ||
        // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
        document?.body;
      return createPortal(
        AnchoredOverlayComponent,
        portalElement
      ) as React.ReactPortal;
    }

    return AnchoredOverlayComponent;
  }
);

AnchoredOverlay.displayName = 'AnchoredOverlay';

export default AnchoredOverlay;

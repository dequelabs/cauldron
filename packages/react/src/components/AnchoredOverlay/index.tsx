import { autoUpdate, type Placement, type Coords } from '@floating-ui/dom';
import React, { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  useFloating,
  offset as offsetMiddleware,
  flip as flipMiddleware,
  autoPlacement as autoPlacementMiddleware,
  shift as shiftMiddleware
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
  target: Target | React.MutableRefObject<Target> | React.RefObject<Target>;
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
  portal?: React.RefObject<HTMLElement> | HTMLElement;
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
    const { floatingStyles, placement, middlewareData } = useFloating({
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
          : flipMiddleware(),
        shiftMiddleware({ crossAxis: false })
      ].filter(Boolean),
      elements: {
        reference: resolveElement(target),
        floating: ref.current
      },
      whileElementsMounted: autoUpdate
    });

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
      <Component ref={ref} {...props} style={{ ...floatingStyles, ...style }}>
        {children}
      </Component>
    );

    if (portal && !isBrowser()) {
      return null;
    }

    return portal && typeof portal !== 'undefined'
      ? (createPortal(
          AnchoredOverlayComponent,
          (portal && 'current' in portal ? portal.current : portal) ||
            // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
            document?.body
        ) as React.ReactPortal)
      : AnchoredOverlayComponent;
  }
);

AnchoredOverlay.displayName = 'AnchoredOverlay';

export default AnchoredOverlay;

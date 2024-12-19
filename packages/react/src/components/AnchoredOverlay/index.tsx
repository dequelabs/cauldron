import { autoUpdate, type Placement } from '@floating-ui/dom';
import React, { forwardRef, useEffect } from 'react';
import {
  useFloating,
  offset as offsetMiddleware,
  flip as flipMiddleware,
  autoPlacement as autoPlacementMiddleware
} from '@floating-ui/react-dom';
import { type PolymorphicProps } from '../../utils/polymorphicComponent';
import resolveElement from '../../utils/resolveElement';
import useSharedRef from '../../utils/useSharedRef';
import useEscapeKey from '../../utils/useEscapeKey';
import useFocusTrap from '../../utils/useFocusTrap';

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
  /** An optional offset number to position the anchor element from its anchored target. */
  offset?: number;
  /** When set, traps focus within the AnchoredOverlay. */
  focusTrap?: boolean;
  /** When `focusTrap` is true, optional arguments to configure the focus trap. */
  focusTrapOptions?: Parameters<typeof useFocusTrap>[1];
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
      ...props
    }: AnchoredOverlayProps<Overlay, Target>,
    refProp: React.Ref<Overlay>
  ) => {
    const ref = useSharedRef<HTMLElement | null>(refProp);
    const Component = as || 'div';
    const { floatingStyles, placement } = useFloating({
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
          : flipMiddleware()
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

    useFocusTrap(ref, {
      disabled: !focusTrap,
      ...(focusTrap ? focusTrapOptions : {})
    });

    useEffect(() => {
      if (typeof onPlacementChange === 'function') {
        onPlacementChange(placement);
      }
    }, [placement]);

    return (
      <Component ref={ref} {...props} style={{ ...floatingStyles, ...style }}>
        {children}
      </Component>
    );
  }
);

AnchoredOverlay.displayName = 'AnchoredOverlay';

export default AnchoredOverlay;

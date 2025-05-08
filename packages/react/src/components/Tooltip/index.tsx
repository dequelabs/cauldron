import React, { useState, useRef, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { createPortal } from 'react-dom';
import { useId } from 'react-id-generator';
import AnchoredOverlay from '../AnchoredOverlay';
import { isBrowser } from '../../utils/is-browser';
import { addIdRef, hasIdRef, removeIdRef } from '../../utils/idRefs';
import resolveElement from '../../utils/resolveElement';

const TIP_HIDE_DELAY = 100;

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  target: React.RefObject<HTMLElement> | HTMLElement;
  variant?: 'text' | 'info' | 'big';
  association?: 'aria-labelledby' | 'aria-describedby' | 'none';
  show?: boolean | undefined;
  defaultShow?: boolean;
  placement?: React.ComponentProps<typeof AnchoredOverlay>['placement'];
  portal?: React.RefObject<HTMLElement> | HTMLElement;
  hideElementOnHidden?: boolean;
}

// fires a custom "cauldron:tooltip:show" / "cauldron:tooltip:hide" event
// to allow projects using cauldron to hook into when a tooltip is shown/hidden
const fireCustomEvent = (show: boolean, button?: HTMLElement | null) => {
  if (!button) {
    return;
  }

  const event = new CustomEvent(
    show ? 'cauldron:tooltip:show' : 'cauldron:tooltip:hide',
    {
      bubbles: true
    }
  );

  button.dispatchEvent(event);
};

export default function Tooltip({
  id: propId,
  placement: initialPlacement = 'auto',
  children,
  portal,
  target,
  association = 'aria-describedby',
  variant = 'text',
  show: showProp,
  defaultShow = false,
  hideElementOnHidden = false,
  className,
  ...props
}: TooltipProps): React.JSX.Element {
  const [id] = propId ? [propId] : useId(1, 'tooltip');
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showTooltip, setShowTooltip] = useState(!!showProp || defaultShow);
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(
    null
  );
  const [placement, setPlacement] = useState(initialPlacement);
  const [arrowShift, setArrowShift] = useState<number | null>();
  const hasAriaAssociation = association !== 'none';

  // Show the tooltip
  const show: EventListener = useCallback(async () => {
    const targetElement = resolveElement(target);
    // Clear the hide timeout if there was one pending
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowTooltip(true);
    fireCustomEvent(true, targetElement);
  }, [target]);

  // Hide the tooltip
  const hide: EventListener = useCallback(() => {
    const targetElement = resolveElement(target);
    if (!hideTimeoutRef.current) {
      hideTimeoutRef.current = setTimeout(() => {
        hideTimeoutRef.current = null;
        setShowTooltip(false);
        fireCustomEvent(false, targetElement);
      }, TIP_HIDE_DELAY);
    }

    return () => {
      clearTimeout(hideTimeoutRef.current as unknown as number);
    };
  }, [target]);

  useEffect(() => {
    if (typeof showProp === 'boolean') {
      setShowTooltip(showProp);
    }
  }, [showProp]);

  // Handle hover and focus events for the targetElement
  useEffect(() => {
    const targetElement = resolveElement(target);
    if (typeof showProp !== 'boolean') {
      targetElement?.addEventListener('mouseenter', show);
      targetElement?.addEventListener('mouseleave', hide);
      targetElement?.addEventListener('focusin', show);
      targetElement?.addEventListener('focusout', hide);
    }

    return () => {
      targetElement?.removeEventListener('mouseenter', show);
      targetElement?.removeEventListener('mouseleave', hide);
      targetElement?.removeEventListener('focusin', show);
      targetElement?.removeEventListener('focusout', hide);
    };
  }, [target, show, hide, showProp]);

  // Handle hover events for the tooltipElement
  useEffect(() => {
    if (typeof showProp !== 'boolean') {
      tooltipElement?.addEventListener('mouseenter', show);
      tooltipElement?.addEventListener('mouseleave', hide);
    }

    return () => {
      tooltipElement?.removeEventListener('mouseenter', show);
      tooltipElement?.removeEventListener('mouseleave', hide);
    };
  }, [tooltipElement, show, hide, showProp]);

  // Keep the target's id in sync
  useEffect(() => {
    const targetElement = resolveElement(target);
    if (hasAriaAssociation) {
      const idRefs = targetElement?.getAttribute(association);
      if (!hasIdRef(idRefs, id)) {
        targetElement?.setAttribute(association, addIdRef(idRefs, id));
      }
    }

    return () => {
      if (targetElement && hasAriaAssociation) {
        const idRefs = targetElement.getAttribute(association);
        targetElement.setAttribute(association, removeIdRef(idRefs, id));
      }
    };
  }, [target, id, association]);

  const updateArrowShiftPosition = useCallback(({ x }: { x: number }) => {
    if (variant === 'big' || x === 0) {
      setArrowShift(null)
      return
    }

    // The tooltip shift position is inversely related to the direction
    // that the arrow needs to shift
    setArrowShift(x * -1)
  }, [variant])

  return (
    <>
      {(showTooltip || hideElementOnHidden) && isBrowser()
        ? createPortal(
            <AnchoredOverlay
              id={id}
              target={target}
              placement={initialPlacement}
              onPlacementChange={setPlacement}
              open={showTooltip && typeof showProp !== 'boolean'}
              onOpenChange={setShowTooltip}
              onShiftChange={updateArrowShiftPosition}
              className={classnames(
                'Tooltip',
                `Tooltip--${placement}`,
                className,
                {
                  TooltipInfo: variant === 'info',
                  'Tooltip--hidden': !showTooltip && hideElementOnHidden,
                  'Tooltip--big': variant === 'big'
                }
              )}
              ref={setTooltipElement}
              role="tooltip"
              offset={8}
              {...props}
            >
              {variant !== 'big' && <div className="TooltipArrow" style={arrowShift ? { transform: `translateX(${arrowShift}px)` } : undefined} />}
              {children}
            </AnchoredOverlay>,
            (portal && 'current' in portal ? portal.current : portal) ||
              // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
              document?.body
          )
        : null}
    </>
  );
}

Tooltip.displayName = 'Tooltip';

interface TooltipHeadProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const TooltipHead = ({ className, ...other }: TooltipHeadProps) => (
  <div className={classnames('TooltipHead', className)} {...other} />
);

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const TooltipContent = ({
  className,
  ...other
}: TooltipContentProps) => (
  <div className={classnames('TooltipContent', className)} {...other} />
);

import React, { useState, useRef, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { createPortal } from 'react-dom';
import { useId } from 'react-id-generator';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import { isBrowser } from '../../utils/is-browser';
import { addIdRef, hasIdRef, removeIdRef } from '../../utils/idRefs';

const TIP_HIDE_DELAY = 100;

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  target: React.RefObject<HTMLElement> | HTMLElement;
  variant?: 'text' | 'info' | 'big';
  association?: 'aria-labelledby' | 'aria-describedby' | 'none';
  show?: boolean | undefined;
  defaultShow?: boolean;
  placement?: Placement;
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
}: TooltipProps): JSX.Element {
  const [id] = propId ? [propId] : useId(1, 'tooltip');
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showTooltip, setShowTooltip] = useState(!!showProp || defaultShow);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const hasAriaAssociation = association !== 'none';

  const { styles, attributes, update } = usePopper(
    targetElement,
    tooltipElement,
    {
      placement: initialPlacement,
      modifiers: [
        { name: 'preventOverflow', options: { padding: 8 } },
        {
          name: 'flip',
          options: { fallbackPlacements: ['left', 'right', 'top', 'bottom'] }
        },
        { name: 'offset', options: { offset: [0, 8] } },
        { name: 'arrow', options: { padding: 5, element: arrowElement } }
      ]
    }
  );

  // Show the tooltip
  const show: EventListener = useCallback(async () => {
    // Clear the hide timeout if there was one pending
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    // Make sure we update the tooltip position when showing
    // in case the target's position changed without popper knowing
    if (update) {
      await update();
    }
    setShowTooltip(true);
    fireCustomEvent(true, targetElement);
  }, [
    targetElement,
    // update starts off as null
    update
  ]);

  // Hide the tooltip
  const hide: EventListener = useCallback(() => {
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
  }, [targetElement]);

  // Keep targetElement in sync with target prop
  useEffect(() => {
    const targetElement =
      target && 'current' in target ? target.current : target;
    setTargetElement(targetElement);
  }, [target]);

  useEffect(() => {
    if (typeof showProp === 'boolean') {
      setShowTooltip(showProp);
    }
  }, [showProp]);

  // Get popper placement
  const placement: Placement =
    (attributes.popper &&
      (attributes.popper['data-popper-placement'] as Placement)) ||
    initialPlacement;

  // Only listen to key ups when the tooltip is visible
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' ||
        event.key === 'Esc' ||
        event.keyCode === 27
      ) {
        setShowTooltip(false);
      }
    };

    const targetElement = document.body;
    if (showTooltip && typeof showProp !== 'boolean') {
      targetElement.addEventListener('keyup', handleEscape, { capture: true });
    } else {
      targetElement.removeEventListener('keyup', handleEscape, {
        capture: true
      });
    }

    return () => {
      targetElement.removeEventListener('keyup', handleEscape, {
        capture: true
      });
    };
  }, [showTooltip, showProp]);

  // Handle hover and focus events for the targetElement
  useEffect(() => {
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
  }, [targetElement, show, hide, showProp]);

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
  }, [targetElement, id, association]);

  return (
    <>
      {(showTooltip || hideElementOnHidden) && isBrowser()
        ? createPortal(
            <div
              id={id}
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
              style={styles.popper}
              {...attributes.popper}
              {...props}
            >
              {variant !== 'big' && (
                <div
                  className="TooltipArrow"
                  ref={setArrowElement}
                  style={styles.arrow}
                />
              )}
              {children}
            </div>,
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

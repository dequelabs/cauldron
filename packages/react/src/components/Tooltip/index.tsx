import React, { useState, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useId } from 'react-id-generator';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  target: React.RefObject<HTMLElement> | HTMLElement;
  variant?: 'text' | 'info' | 'big';
  association?: 'aria-labelledby' | 'aria-describedby';
  show?: boolean | undefined;
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

  const event = new Event(
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
  show: showProp = false,
  hideElementOnHidden = false,
  ...props
}: TooltipProps) {
  const [id] = propId ? [propId] : useId(1, 'tooltip');
  const [placement, setPlacement] = useState(initialPlacement);
  const [showTooltip, setShowTooltip] = useState(!!showProp);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

  const { styles, attributes, update } = usePopper(
    targetElement,
    tooltipElement,
    {
      placement: initialPlacement,
      modifiers: [
        { name: 'preventOverflow', options: { padding: 8 } },
        { name: 'flip' },
        { name: 'offset', options: { offset: [0, 8] } },
        { name: 'arrow', options: { padding: 5, element: arrowElement } }
      ]
    }
  );

  const show = async () => {
    if (update) {
      await update();
    }
    setShowTooltip(true);
    fireCustomEvent(true, targetElement);
  };
  const hide = ({ target }: FocusEvent | MouseEvent) => {
    if (document.activeElement !== target) {
      setShowTooltip(false);
      fireCustomEvent(false, targetElement);
    }
  };

  useEffect(() => {
    const targetElement =
      target && 'current' in target ? target.current : target;
    setTargetElement(targetElement);
  }, [target]);

  const popperPlacement: Placement =
    (attributes.popper &&
      (attributes.popper['data-popper-placement'] as Placement)) ||
    initialPlacement;
  useEffect(() => {
    if (popperPlacement) {
      setPlacement(popperPlacement);
    }
  }, [popperPlacement]);

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
    if (showTooltip) {
      targetElement.addEventListener('keyup', handleEscape);
    } else {
      targetElement.removeEventListener('keyup', handleEscape);
    }

    return () => {
      targetElement.removeEventListener('keyup', handleEscape);
    };
  }, [show]);

  useEffect(() => {
    if (typeof show !== undefined) {
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
  }, [targetElement, show]);

  useEffect(() => {
    const attrText = targetElement?.getAttribute(association);
    if (!attrText?.includes(id || '')) {
      targetElement?.setAttribute(
        association,
        [id, attrText].filter(Boolean).join(' ')
      );
    }
  }, [targetElement, id]);

  return showTooltip || hideElementOnHidden
    ? createPortal(
        <div
          id={id}
          className={classnames('Tooltip', `Tooltip--${placement}`, {
            TooltipInfo: variant === 'info',
            'Tooltip--hidden': !showTooltip && hideElementOnHidden,
            'Tooltip--big': variant === 'big'
          })}
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
          document.body
      )
    : null;
}

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  target: PropTypes.any.isRequired,
  association: PropTypes.oneOf(['aria-labelledby', 'aria-describedby']),
  show: PropTypes.bool,
  placement: PropTypes.string,
  variant: PropTypes.string,
  portal: PropTypes.any
};

export const TooltipHead = ({
  className,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classnames('TooltipHead', className)} {...other} />
);

export const TooltipContent = ({
  className,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classnames('TooltipContent', className)} {...other} />
);

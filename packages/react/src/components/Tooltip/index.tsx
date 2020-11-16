import React, { useState, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useId } from 'react-id-generator';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'text' | 'info';
  show?: boolean | undefined;
  placement?: Placement;
  target: React.RefObject<HTMLElement> | HTMLElement;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
}

export default function Tooltip({
  id: propId,
  placement: initialPlacement = 'auto',
  children,
  portal,
  target,
  variant = 'text',
  show: showProp = false,
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

  const { styles, attributes } = usePopper(targetElement, tooltipElement, {
    placement: initialPlacement,
    modifiers: [
      { name: 'preventOverflow', options: { padding: 8 } },
      { name: 'flip' },
      { name: 'offset', options: { offset: [0, 8] } },
      { name: 'arrow', options: { padding: 5, element: arrowElement } }
    ]
  });

  const show = () => setShowTooltip(true);
  const hide = ({ target }: FocusEvent | MouseEvent) => {
    if (document.activeElement !== target) {
      setShowTooltip(false);
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
    const ariaDescription = targetElement?.getAttribute('aria-describedby');
    if (!ariaDescription?.includes(id || '')) {
      targetElement?.setAttribute(
        'aria-describedby',
        [id, ariaDescription].filter(Boolean).join(' ')
      );
    }
  }, [targetElement, id]);

  return showTooltip
    ? createPortal(
        <div
          id={id}
          className={classnames('Tooltip', `Tooltip--${placement}`, {
            TooltipInfo: variant === 'info'
          })}
          ref={setTooltipElement}
          role="tooltip"
          style={styles.popper}
          {...attributes.popper}
          {...props}
        >
          <div
            className="TooltipArrow"
            ref={setArrowElement}
            style={styles.arrow}
          />
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
  show: PropTypes.bool,
  placement: PropTypes.string,
  variant: PropTypes.string,
  target: PropTypes.any.isRequired,
  portal: PropTypes.any
};

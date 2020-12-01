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
  variant?: 'text' | 'info';
  association?: 'aria-labelledby' | 'aria-describedby';
  show?: boolean | undefined;
  placement?: Placement;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
  hideElementOnHidden?: boolean;
}

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
  };
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
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.body.addEventListener('keyup', handleEscape);
    } else {
      document.body.removeEventListener('keyup', handleEscape);
    }

    return () => {
      document.body.removeEventListener('keyup', handleEscape);
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
            'Tooltip--hidden': !showTooltip && hideElementOnHidden
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
  target: PropTypes.any.isRequired,
  association: PropTypes.oneOf(['aria-labelledby', 'aria-describedby']),
  show: PropTypes.bool,
  placement: PropTypes.string,
  variant: PropTypes.string,
  portal: PropTypes.any
};

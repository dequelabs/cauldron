import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useId } from 'react-id-generator';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import ClickOutsideListener from '../ClickOutsideListener';
import Button from '../Button';
import FocusTrap from 'focus-trap-react';
import { isBrowser } from '../../utils/is-browser';

export interface PopoverProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Partial<AlertPopoverProps> {
  children?: React.ReactNode;
  target: React.RefObject<HTMLElement> | HTMLElement;
  variant?: 'alert' | 'custom';
  association: 'aria-labelledby' | 'aria-describedby';
  show: boolean;
  onClose: () => void;
  placement?: Placement;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
}

interface AlertPopoverProps {
  applyButtonText?: string;
  onApply?: () => void;
  closeButtonText?: string;
  infoText: string;
}

const AlertPopoverContent = ({
  onClose,
  applyButtonText = 'Apply',
  onApply,
  closeButtonText = 'Close',
  infoText
}: AlertPopoverProps & Pick<PopoverProps, 'onClose'>) => {
  return (
    <>
      {infoText}
      <Button className="CloseBtn" onClick={onClose}>
        {closeButtonText}
      </Button>
      <Button className="ApplyBtn" onClick={onApply}>
        {applyButtonText}
      </Button>
    </>
  );
};

export default function Popover({
  id: propId,
  placement: initialPlacement = 'auto',
  children,
  portal,
  target,
  association = 'aria-describedby',
  variant = 'custom',
  show = false,
  onClose,
  className,
  applyButtonText,
  closeButtonText,
  infoText,
  onApply,
  ...props
}: PopoverProps): JSX.Element {
  const [id] = propId ? [propId] : useId(1, 'popover');

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [popoverElement, setPopoverElement] = useState<HTMLElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

  const { styles, attributes } = usePopper(targetElement, popoverElement, {
    placement: initialPlacement,
    modifiers: [
      { name: 'preventOverflow', options: { padding: 8 } },
      { name: 'flip' },
      { name: 'offset', options: { offset: [0, 8] } },
      { name: 'arrow', options: { padding: 5, element: arrowElement } }
    ]
  });

  const placement: Placement =
    (attributes.popper &&
      (attributes.popper['data-popper-placement'] as Placement)) ||
    initialPlacement;

  // Keep targetElement in sync with target prop
  useEffect(() => {
    const targetElement =
      target && 'current' in target ? target.current : target;
    setTargetElement(targetElement);
  }, [target]);

  useEffect(() => {
    if (show && popoverElement) {
      // Find the first focusable element inside the container
      const firstFocusableElement = popoverElement.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (firstFocusableElement instanceof HTMLElement) {
        firstFocusableElement.focus();
      }
    }
  }, [show, popoverElement]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' ||
        event.key === 'Esc' ||
        event.keyCode === 27
      ) {
        onClose();
      }
    };

    if (show) {
      document.body.addEventListener('keyup', handleEscape);
    } else {
      document.body.removeEventListener('keyup', handleEscape);
    }

    return () => {
      document.body.removeEventListener('keyup', handleEscape);
    };
  }, [show]);

  useEffect(() => {
    const attrText = targetElement?.getAttribute(association);
    if (!attrText?.includes(id || '')) {
      targetElement?.setAttribute(
        association,
        [id, attrText].filter(Boolean).join(' ')
      );
    }
  }, [targetElement, id]);

  const handleClickOutside = () => {
    if (show) {
      onClose();
    }
  };

  if (!show || !isBrowser()) return <></>;

  return createPortal(
    <FocusTrap
      focusTrapOptions={{
        allowOutsideClick: true,
        fallbackFocus: '.BorderLeft'
      }}
    >
      <ClickOutsideListener onClickOutside={handleClickOutside}>
        <div
          id={id}
          className={classnames('Popover', `Popover--${placement}`, className, {
            'Popover--hidden': !show,
            'Popover--alert': variant === 'alert'
          })}
          ref={setPopoverElement}
          role="tooltip"
          style={styles.popper}
          {...attributes.popper}
          {...props}
        >
          <div
            className="PopoverArrow"
            ref={setArrowElement}
            style={styles.arrow}
          />
          <div className="BorderLeft" />
          {variant === 'alert' ? (
            <AlertPopoverContent
              applyButtonText={applyButtonText}
              onApply={onApply}
              closeButtonText={closeButtonText}
              infoText={infoText || ''}
              onClose={onClose}
            />
          ) : (
            children
          )}
        </div>
      </ClickOutsideListener>
    </FocusTrap>,
    (portal && 'current' in portal ? portal.current : portal) || document.body
  );
}

Popover.displayName = 'Tooltip';

Popover.propTypes = {
  children: PropTypes.node,
  target: PropTypes.any.isRequired,
  association: PropTypes.oneOf(['aria-labelledby', 'aria-describedby']),
  show: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  placement: PropTypes.string,
  variant: PropTypes.string,
  portal: PropTypes.any
};

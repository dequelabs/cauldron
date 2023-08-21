import React, { useState, useEffect, ReactNode, forwardRef, Ref } from 'react';
import { createPortal } from 'react-dom';
import { useId } from 'react-id-generator';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import { isBrowser } from '../../utils/is-browser';

import classnames from 'classnames';
import ClickOutsideListener from '../ClickOutsideListener';
import Button from '../Button';
import FocusTrap from 'focus-trap-react';
import focusableSelector from '../../utils/focusable-selector';

export type PopoverVariant = 'alert' | 'custom';

type BaseProps = React.HTMLAttributes<HTMLDivElement> & {
  target: React.RefObject<HTMLElement> | HTMLElement;
  variant?: PopoverVariant;
  show: boolean;
  onClose: () => void;
  placement?: Placement;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
};

type CustomProps = BaseProps & {
  variant: 'custom';
  applyButtonText?: string;
  onApply?: () => void;
  closeButtonText?: string;
  infoText?: string;
  chidlren: ReactNode;
};

type AlertProps = BaseProps & {
  variant: 'alert';
  applyButtonText?: string;
  onApply: () => void;
  closeButtonText?: string;
  infoText: string;
  chidlren?: ReactNode;
};

export type PopoverProps = AlertProps | CustomProps;

const AlertPopoverContent = ({
  onClose,
  applyButtonText = 'Apply',
  onApply,
  closeButtonText = 'Close',
  infoText
}: Pick<
  PopoverProps,
  'onClose' | 'applyButtonText' | 'onApply' | 'closeButtonText' | 'infoText'
>) => {
  return (
    <>
      {infoText}
      <Button className="Popover__apply" onClick={onApply} thin>
        {applyButtonText}
      </Button>
      <Button className="Popover__close" onClick={onClose} thin>
        {closeButtonText}
      </Button>
    </>
  );
};

const Popover = forwardRef<HTMLInputElement, PopoverProps>(
  (
    {
      id: propId,
      placement: initialPlacement = 'auto',
      children,
      portal,
      target,
      variant = 'custom',
      show = false,
      onClose,
      className,
      applyButtonText,
      closeButtonText,
      infoText,
      onApply,
      ...props
    }: PopoverProps,
    ref: Ref<HTMLElement>
  ): JSX.Element => {
    const [id] = propId ? [propId] : useId(1, 'popover');

    const [targetElement, setTargetElement] = useState<HTMLElement | null>(
      null
    );
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
          focusableSelector
        );

        if (firstFocusableElement instanceof HTMLElement) {
          firstFocusableElement.focus();
        }
      }

      targetElement?.setAttribute('aria-expanded', Boolean(show).toString());
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
      const attrText = targetElement?.getAttribute('aria-controls');
      if (!attrText?.includes(id)) {
        targetElement?.setAttribute('aria-controls', id);
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
          fallbackFocus: '.Popover__borderLeft'
        }}
      >
        <ClickOutsideListener onClickOutside={handleClickOutside}>
          <div
            id={id}
            className={classnames(
              'Popover',
              `Popover--${placement}`,
              className,
              {
                'Popover--hidden': !show,
                'Popover--alert': variant === 'alert'
              }
            )}
            ref={setPopoverElement}
            role="dialog"
            style={styles.popper}
            {...attributes.popper}
            {...props}
          >
            <div
              className="Popover__popoverArrow"
              ref={setArrowElement}
              style={styles.arrow}
            />
            <div className="Popover__borderLeft" />
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
);

Popover.displayName = 'Popover';

export default Popover;

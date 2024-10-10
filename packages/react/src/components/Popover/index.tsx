import React, { useState, useEffect, ReactNode, forwardRef, Ref } from 'react';
import { createPortal } from 'react-dom';
import { useId } from 'react-id-generator';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import { isBrowser } from '../../utils/is-browser';
import { Cauldron } from '../../types';
import classnames from 'classnames';
import ClickOutsideListener from '../ClickOutsideListener';
import Button from '../Button';
import FocusTrap from 'focus-trap-react';
import focusableSelector from '../../utils/focusable-selector';
import AriaIsolate from '../../utils/aria-isolate';
import useSharedRef from '../../utils/useSharedRef';
import useEscapeKey from '../../utils/useEscapeKey';

export type PopoverVariant = 'prompt' | 'custom';

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
  infoText?: ReactNode;
  children: ReactNode;
} & Cauldron.LabelProps;

type PromptProps = BaseProps & {
  variant: 'prompt';
  applyButtonText?: string;
  onApply: () => void;
  closeButtonText?: string;
  infoText: ReactNode;
  children?: ReactNode;
};

export type PopoverProps = PromptProps | CustomProps;

const PromptPopoverContent = ({
  onClose,
  applyButtonText = 'Apply',
  onApply,
  closeButtonText = 'Close',
  infoText,
  infoTextId
}: Pick<
  PopoverProps,
  'onClose' | 'applyButtonText' | 'onApply' | 'closeButtonText' | 'infoText'
> & { infoTextId: string }) => {
  return (
    <>
      <span id={infoTextId}>{infoText}</span>
      <Button className="Popover__apply" onClick={onApply} thin>
        {applyButtonText}
      </Button>
      <Button
        className="Popover__close"
        variant="secondary"
        onClick={onClose}
        thin
      >
        {closeButtonText}
      </Button>
    </>
  );
};

const Popover = forwardRef<HTMLDivElement, PopoverProps>(
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
    ref: Ref<HTMLDivElement>
  ): JSX.Element | null => {
    const [id] = propId ? [propId] : useId(1, 'popover');

    const [targetElement, setTargetElement] = useState<HTMLElement | null>(
      null
    );

    const [isolator, setIsolator] = useState<AriaIsolate | null>(null);

    const popoverRef = useSharedRef<HTMLDivElement>(ref);

    const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

    const { styles, attributes } = usePopper(
      targetElement,
      popoverRef?.current,
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

    const placement: Placement =
      (attributes.popper &&
        (attributes.popper['data-popper-placement'] as Placement)) ||
      initialPlacement;

    const additionalProps =
      variant === 'prompt' && !props['aria-label']
        ? { 'aria-labelledby': `${id}-label` }
        : {};

    // Keep targetElement in sync with target prop
    useEffect(() => {
      const targetElement =
        target && 'current' in target ? target.current : target;
      setTargetElement(targetElement);
    }, [target]);

    useEffect(() => {
      return () => {
        isolator?.deactivate();
      };
    }, []);

    useEffect(() => {
      if (!isolator) return;

      if (show) {
        isolator.activate();
      } else {
        isolator.deactivate();
      }

      return () => {
        isolator?.deactivate();
      };
    }, [show, isolator]);

    useEffect(() => {
      if (popoverRef.current) attachIsolator();
    }, [popoverRef.current]);

    useEffect(() => {
      if (show && popoverRef.current) {
        // Find the first focusable element inside the container
        const firstFocusableElement =
          popoverRef.current.querySelector(focusableSelector);

        if (firstFocusableElement instanceof HTMLElement) {
          firstFocusableElement.focus();
        }
      }

      targetElement?.setAttribute('aria-expanded', Boolean(show).toString());
    }, [show, popoverRef.current]);

    useEffect(() => {
      const attrText = targetElement?.getAttribute('aria-controls');
      const hasPopupAttr = targetElement?.getAttribute('aria-haspopup');

      if (!attrText?.includes(id) && show) {
        targetElement?.setAttribute('aria-controls', id);
      }

      if (!hasPopupAttr) {
        targetElement?.setAttribute('aria-haspopup', 'true');
      }
    }, [targetElement, id, show]);

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (e.target === targetElement) {
        return;
      }
      if (show) {
        handleClosePopover();
      }
    };

    const attachIsolator = () => {
      if (popoverRef?.current) {
        setIsolator(new AriaIsolate(popoverRef?.current));
      }
    };

    const handleClosePopover = () => {
      isolator?.deactivate();
      if (show) {
        onClose();
      }
    };

    useEscapeKey(
      {
        callback: handleClosePopover,
        active: show
      },
      [show]
    );

    if (!show || !isBrowser()) return null;

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
                'Popover--prompt': variant === 'prompt'
              }
            )}
            ref={popoverRef}
            role="dialog"
            style={styles.popper}
            {...attributes.popper}
            {...additionalProps}
            {...props}
          >
            <div
              className="Popover__popoverArrow"
              ref={setArrowElement}
              style={styles.arrow}
            />
            <div className="Popover__borderLeft" />
            {variant === 'prompt' ? (
              <PromptPopoverContent
                applyButtonText={applyButtonText}
                onApply={onApply}
                closeButtonText={closeButtonText}
                infoText={infoText || ''}
                onClose={handleClosePopover}
                infoTextId={`${id}-label`}
              />
            ) : (
              children
            )}
          </div>
        </ClickOutsideListener>
      </FocusTrap>,
      (portal && 'current' in portal ? portal.current : portal) ||
        // Dependent on "isBrowser" check above:
        // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
        document.body
    );
  }
);

Popover.displayName = 'Popover';

export default Popover;

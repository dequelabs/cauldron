import React, {
  useState,
  useEffect,
  ReactNode,
  forwardRef,
  Ref,
  useRef,
  MutableRefObject
} from 'react';
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
import AriaIsolate from '../../utils/aria-isolate';

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

const Popover = forwardRef<HTMLElement, PopoverProps>(
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
  ): JSX.Element | null => {
    const [id] = propId ? [propId] : useId(1, 'popover');

    const [targetElement, setTargetElement] = useState<HTMLElement | null>(
      null
    );

    const [isolator, setIsolator] = useState<AriaIsolate | null>(null);

    const popoverElement = useRef<HTMLDivElement | null>(null);

    const popoverRef =
      (ref as MutableRefObject<HTMLDivElement>) || popoverElement;

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

      if (show) isolator.activate();
      else isolator.deactivate();
    }, [show, isolator]);

    useEffect(() => {
      if (popoverRef.current) attachIsolator();
    }, [popoverRef.current]);

    useEffect(() => {
      if (show && popoverRef.current) {
        // Find the first focusable element inside the container
        const firstFocusableElement = popoverRef.current.querySelector(
          focusableSelector
        );

        if (firstFocusableElement instanceof HTMLElement) {
          firstFocusableElement.focus();
        }
      }

      targetElement?.setAttribute('aria-expanded', Boolean(show).toString());
    }, [show, popoverRef.current]);

    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (
          event.key === 'Escape' ||
          event.key === 'Esc' ||
          event.keyCode === 27
        ) {
          handleClosePopover();
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
      const hasPopupAttr = targetElement?.getAttribute('aria-haspopup');

      if (!attrText?.includes(id) && show) {
        targetElement?.setAttribute('aria-controls', id);
      }

      if (!hasPopupAttr) {
        targetElement?.setAttribute('aria-haspopup', 'true');
      }
    }, [targetElement, id, show]);

    const handleClickOutside = () => {
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
                'Popover--alert': variant === 'alert'
              }
            )}
            ref={popoverRef}
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
                onClose={handleClosePopover}
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

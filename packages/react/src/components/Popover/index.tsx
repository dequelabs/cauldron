import React, {
  useState,
  useEffect,
  ReactNode,
  forwardRef,
  Ref,
  useCallback
} from 'react';
import { useId } from 'react-id-generator';
import { Cauldron } from '../../types';
import classnames from 'classnames';
import AnchoredOverlay from '../AnchoredOverlay';
import ClickOutsideListener from '../ClickOutsideListener';
import Button from '../Button';
import AriaIsolate from '../../utils/aria-isolate';
import useSharedRef from '../../utils/useSharedRef';
import useEscapeKey from '../../utils/useEscapeKey';
import useFocusTrap from '../../utils/useFocusTrap';
import { isBrowser } from '../../utils/is-browser';

export type PopoverVariant = 'prompt' | 'custom';

type BaseProps = React.HTMLAttributes<HTMLDivElement> & {
  target: React.RefObject<HTMLElement> | HTMLElement;
  variant?: PopoverVariant;
  show: boolean;
  onClose: () => void;
  placement?: React.ComponentProps<typeof AnchoredOverlay>['placement'];
  /** Render the popover in a different location in the dom. */
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
  ): React.JSX.Element | null => {
    const [id] = propId ? [propId] : useId(1, 'popover');
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(
      null
    );
    const [isolator, setIsolator] = useState<AriaIsolate | null>(null);
    const popoverRef = useSharedRef<HTMLDivElement>(ref);
    const [placement, setPlacement] = useState(initialPlacement);

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
      targetElement?.setAttribute('aria-expanded', Boolean(show).toString());
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

    const handleClosePopover = () => {
      isolator?.deactivate();
      if (show) {
        onClose();
      }
    };

    const handleClickOutside = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (e.target === targetElement) {
          return;
        }
        if (show) {
          handleClosePopover();
        }
      },
      [show, targetElement, handleClosePopover]
    );

    const attachIsolator = () => {
      if (popoverRef?.current) {
        setIsolator(new AriaIsolate(popoverRef?.current));
      }
    };

    useEscapeKey(
      {
        callback: handleClosePopover,
        active: show
      },
      [show]
    );

    useFocusTrap(popoverRef, { disabled: !show, returnFocus: true });

    if (!show || !isBrowser()) {
      return null;
    }

    return (
      <ClickOutsideListener onClickOutside={handleClickOutside}>
        <AnchoredOverlay
          id={id}
          className={classnames('Popover', `Popover--${placement}`, className, {
            'Popover--hidden': !show,
            'Popover--prompt': variant === 'prompt'
          })}
          ref={popoverRef}
          role="dialog"
          target={target}
          open={show}
          placement={initialPlacement}
          onPlacementChange={setPlacement}
          offset={8}
          // guarded by isBrowser() check
          // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
          portal={portal || document?.body}
          {...additionalProps}
          {...props}
        >
          <div className="Popover__popoverArrow" />
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
        </AnchoredOverlay>
      </ClickOutsideListener>
    );
  }
);

Popover.displayName = 'Popover';

export default Popover;

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
import { useLayer, LayerProvider } from '../../utils/layer';
import useSharedRef from '../../utils/useSharedRef';
import useFocusTrap from '../../utils/useFocusTrap';
import { isBrowser } from '../../utils/is-browser';

export type PopoverVariant = 'prompt' | 'custom';

type BaseProps = React.HTMLAttributes<HTMLDivElement> & {
  target: React.RefObject<HTMLElement | null> | HTMLElement;
  variant?: PopoverVariant;
  show: boolean;
  onClose: () => void;
  placement?: React.ComponentProps<typeof AnchoredOverlay>['placement'];
  /** Render the popover in a different location in the dom. */
  portal?: React.RefObject<HTMLElement | null> | HTMLElement;
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
    const layer = useLayer(popoverRef);
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
        setIsolator(new AriaIsolate(popoverRef.current, layer.elements));
      }
    };

    // Return focus to the target: Safari does not focus a button on click,
    // so the element focused before opening can be <body>.
    useFocusTrap(popoverRef, {
      contains: layer.contains,
      disabled: !show,
      returnFocus: true,
      returnFocusElement: target
    });

    if (!show || !isBrowser()) {
      return null;
    }

    return (
      <LayerProvider layer={layer}>
        <ClickOutsideListener
          onClickOutside={handleClickOutside}
          contains={layer.contains}
        >
          <AnchoredOverlay
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
            // a click on content that cannot take focus focuses the popover,
            // so focus stays inside and Escape still reaches it
            tabIndex={-1}
            target={target}
            open={show}
            onOpenChange={handleClosePopover}
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
      </LayerProvider>
    );
  }
);

Popover.displayName = 'Popover';

export default Popover;

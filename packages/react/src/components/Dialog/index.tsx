import React, { useRef, useEffect, useCallback, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Offscreen from '../Offscreen';
import Icon from '../Icon';
import ClickOutsideListener from '../ClickOutsideListener';
import AriaIsolate from '../../utils/aria-isolate';
import { useId } from 'react-id-generator';
import { isBrowser } from '../../utils/is-browser';
import useSharedRef from '../../utils/useSharedRef';
import useFocusTrap from '../../utils/useFocusTrap';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  dialogRef?: React.Ref<HTMLDivElement>;
  onClose?: () => void;
  forceAction?: boolean;
  heading:
    | string
    | React.ReactElement<any>
    | {
        text: React.ReactElement<any> | string;
        level: number | undefined;
      };
  closeButtonText?: string;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
}

const isEscape = (event: KeyboardEvent) =>
  event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27;

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      dialogRef: dialogRefProp,
      forceAction = false,
      className,
      children,
      closeButtonText = 'Close',
      heading,
      show = false,
      portal,
      onClose = () => null,
      ...other
    },
    ref
  ): React.ReactPortal | null => {
    const dialogRef = useSharedRef(dialogRefProp || ref);
    const [headingId] = useId(1, 'dialog-title-');
    const elementRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const isolatorRef = useRef<AriaIsolate>();

    const handleClose = useCallback(() => {
      isolatorRef.current?.deactivate();
      if (show) {
        onClose();
      }
    }, [show, onClose]);

    const handleClickOutside = useCallback(() => {
      if (show && !forceAction) {
        handleClose();
      }
    }, [show, forceAction, handleClose]);

    const focusHeading = useCallback(() => {
      if (headingRef.current) {
        headingRef.current.focus();
      }
      isolatorRef.current?.activate();
    }, []);

    const handleEscape = useCallback(
      (keyboardEvent: KeyboardEvent) => {
        if (!keyboardEvent.defaultPrevented && isEscape(keyboardEvent)) {
          handleClose();
        }
      },
      [handleClose]
    );

    useEffect(() => {
      if (!show || !elementRef.current) return;

      isolatorRef.current = new AriaIsolate(elementRef.current);
      setTimeout(focusHeading);

      return () => {
        isolatorRef.current?.deactivate();
      };
    }, [show, focusHeading]);

    useEffect(() => {
      if (!forceAction) {
        const portalElement = portal
          ? 'current' in portal
            ? portal.current
            : portal
          : document.body;

        if (show) {
          portalElement?.addEventListener('keyup', handleEscape);
        }

        return () => {
          portalElement?.removeEventListener('keyup', handleEscape);
        };
      }
    }, [show, forceAction, portal, handleEscape]);

    useFocusTrap(dialogRef, {
      disabled: !show,
      initialFocusElement: headingRef
    });

    if (!show || !isBrowser()) {
      return null;
    }

    const portalElement = portal
      ? 'current' in portal
        ? portal.current
        : portal
      : // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
        document.body;

    const closeButton = !forceAction ? (
      <button className="Dialog__close" type="button" onClick={handleClose}>
        <Icon type="close" aria-hidden="true" />
        <Offscreen>{closeButtonText}</Offscreen>
      </button>
    ) : null;

    const HeadingLevel = `h${
      typeof heading === 'object' && 'level' in heading && heading.level
        ? heading.level
        : 2
    }` as 'h1';

    const dialog = (
      <ClickOutsideListener onClickOutside={handleClickOutside}>
        <div
          role="dialog"
          className={classNames('Dialog', className, {
            'Dialog--show': show
          })}
          ref={dialogRef}
          aria-labelledby={headingId}
          {...other}
        >
          <div className="Dialog__inner">
            <div className="Dialog__header">
              <HeadingLevel
                className="Dialog__heading"
                ref={headingRef}
                tabIndex={-1}
                id={headingId}
              >
                {typeof heading === 'object' && 'text' in heading
                  ? heading.text
                  : heading}
              </HeadingLevel>
              {closeButton}
            </div>
            {children}
          </div>
        </div>
      </ClickOutsideListener>
    );

    return createPortal(
      dialog,
      // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
      portalElement || document.body
    ) as React.ReactPortal;
  }
);

Dialog.displayName = 'Dialog';

export default Dialog;

interface DialogAlignmentProps {
  align?: 'left' | 'center' | 'right';
}

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement> &
  DialogAlignmentProps & { className?: string };

const DialogContent = ({
  children,
  className,
  align,
  ...other
}: DialogContentProps) => (
  <div
    className={classNames('Dialog__content', className, {
      'text--align-left': align === 'left',
      'text--align-center': align === 'center',
      'text--align-right': align === 'right'
    })}
    {...other}
  >
    {children}
  </div>
);
DialogContent.displayName = 'DialogContent';

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement> &
  DialogAlignmentProps & { className?: string };

const DialogFooter = ({
  children,
  className,
  align,
  ...other
}: DialogFooterProps) => (
  <div
    className={classNames('Dialog__footer', className, {
      'text--align-left': align === 'left',
      'text--align-center': align === 'center',
      'text--align-right': align === 'right'
    })}
    {...other}
  >
    {children}
  </div>
);
DialogFooter.displayName = 'DialogFooter';

export { Dialog, DialogContent, DialogFooter };

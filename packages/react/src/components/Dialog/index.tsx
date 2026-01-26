import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef
} from 'react';
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
import {
  DialogContext,
  useDialogContext,
  type DialogContextValue
} from './DialogContext';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  dialogRef?: React.Ref<HTMLDivElement>;
  onClose?: () => void;
  forceAction?: boolean;
  heading?:
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
    const headingRef = useRef<HTMLHeadingElement>(null);
    const isolatorRef = useRef<AriaIsolate>();

    const headingLevel =
      typeof heading === 'object' && 'level' in heading && heading.level
        ? heading.level
        : 2;

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
      headingRef.current?.focus();
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
      if (!show || !dialogRef.current) return;

      isolatorRef.current = new AriaIsolate(dialogRef.current);
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

    useEffect(() => {
      if (
        process.env.NODE_ENV !== 'production' &&
        show &&
        !heading &&
        dialogRef.current
      ) {
        const hasHeading = dialogRef.current.querySelector('.Dialog__heading');
        if (!hasHeading) {
          console.warn(
            'Dialog: No heading provided. When using a custom header, include a DialogHeading component for accessibility.'
          );
        }
      }
    }, [show, heading]);

    const contextValue: DialogContextValue = useMemo(
      () => ({
        headingId,
        headingRef,
        headingLevel,
        onClose: handleClose,
        forceAction,
        closeButtonText
      }),
      [
        headingId,
        headingRef,
        headingLevel,
        handleClose,
        forceAction,
        closeButtonText
      ]
    );

    if (!show || !isBrowser()) {
      return null;
    }

    const portalElement = portal
      ? 'current' in portal
        ? portal.current
        : portal
      : // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
        document.body;

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
          <DialogContext.Provider value={contextValue}>
            <div className="Dialog__inner">
              {heading ? (
                <DialogHeader>
                  <DialogHeading>
                    {typeof heading === 'object' && 'text' in heading
                      ? heading.text
                      : heading}
                  </DialogHeading>
                  <DialogCloseButton />
                </DialogHeader>
              ) : null}
              {children}
            </div>
          </DialogContext.Provider>
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

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

const DialogHeader = ({ children, className, ...other }: DialogHeaderProps) => (
  <div className={classNames('Dialog__header', className)} {...other}>
    {children}
  </div>
);
DialogHeader.displayName = 'DialogHeader';

export interface DialogHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  level?: number;
}

const DialogHeading = ({
  children,
  className,
  level: levelProp,
  ...other
}: DialogHeadingProps) => {
  const { headingId, headingRef, headingLevel } = useDialogContext();
  const HeadingLevel = `h${levelProp ?? headingLevel}` as 'h1';
  return (
    <HeadingLevel
      className={classNames('Dialog__heading', className)}
      ref={headingRef}
      tabIndex={-1}
      id={headingId}
      {...other}
    >
      {children}
    </HeadingLevel>
  );
};
DialogHeading.displayName = 'DialogHeading';

export interface DialogCloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

const DialogCloseButton = ({
  children,
  className,
  ...other
}: DialogCloseButtonProps) => {
  const { onClose, forceAction, closeButtonText } = useDialogContext();

  if (forceAction) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'DialogCloseButton: Component will not render because forceAction is true. Remove DialogCloseButton from your custom header when using forceAction.'
      );
    }
    return null;
  }

  return (
    <button
      className={classNames('Dialog__close', className)}
      type="button"
      onClick={onClose}
      {...other}
    >
      {children ?? (
        <>
          <Icon type="close" aria-hidden="true" />
          <Offscreen>{closeButtonText}</Offscreen>
        </>
      )}
    </button>
  );
};
DialogCloseButton.displayName = 'DialogCloseButton';

export {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogHeading,
  DialogCloseButton
};

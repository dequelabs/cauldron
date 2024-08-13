import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import classnames from 'classnames';
import { ContentNode } from '../../types';
import Button from '../Button';
import Offscreen from '../Offscreen';
import Tooltip from '../Tooltip';
import Icon from '../Icon';
import useSharedRef from '../../utils/useSharedRef';
import copyTextToClipboard from '../../utils/copyTextToClipboard';

type ButtonProps = React.ComponentProps<typeof Button>;

export interface CopyButtonProps
  extends Omit<ButtonProps, 'onCopy' | 'onClick'> {
  value: string;
  variant?: Extract<
    ButtonProps['variant'],
    'primary' | 'secondary' | 'tertiary'
  >;
  children?: ContentNode;
  notificationLabel?: ContentNode;
  hideVisibleLabel?: boolean;
  tooltipPlacement?: React.ComponentProps<typeof Tooltip>['placement'];
  onCopy?: (text: string) => void;
}

const NOTIFICATION_TIMEOUT_MS = 2000;

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      className,
      value,
      variant = 'tertiary',
      children = 'Copy',
      notificationLabel = 'Copied',
      hideVisibleLabel = false,
      tooltipPlacement = 'auto',
      onCopy,
      ...props
    }: CopyButtonProps,
    ref
  ) => {
    const [copied, setCopied] = useState(false);
    const copyButtonRef = useSharedRef(ref);
    const handleClick = useCallback(() => {
      copyTextToClipboard(value);
      setCopied(true);
      if (typeof onCopy === 'function') {
        onCopy(value);
      }
    }, [value, onCopy]);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, NOTIFICATION_TIMEOUT_MS);

      return () => {
        clearTimeout(timeoutId);
      };
    }, [copied]);

    // The visibility of the tooltip only needs to be controlled
    // when we are visually displaying the notification label
    const showTooltip =
      hideVisibleLabel && !copied ? undefined : copied ? true : false;

    return (
      <>
        <Button
          className={classnames(className, {
            'Button--condensed': hideVisibleLabel
          })}
          ref={copyButtonRef}
          variant={variant}
          onClick={handleClick}
          {...props}
        >
          <Icon type={copied ? 'check-solid' : 'copy'} />
          {hideVisibleLabel ? <Offscreen>{children}</Offscreen> : children}
        </Button>
        <Tooltip
          target={copyButtonRef}
          placement={tooltipPlacement}
          association="none"
          show={showTooltip}
        >
          {hideVisibleLabel && !copied ? children : notificationLabel}
        </Tooltip>
        {typeof document !== 'undefined' &&
          createPortal(
            <Offscreen aria-live="polite">
              {copied ? notificationLabel : ' '}
            </Offscreen>,
            // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
            document.body
          )}
      </>
    );
  }
);

CopyButton.displayName = 'CopyButton';

export default CopyButton;

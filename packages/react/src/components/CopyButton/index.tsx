import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import { ContentNode } from '../../types';
import Button from '../Button';
import Offscreen from '../Offscreen';
import Tooltip from '../Tooltip';
import Icon from '../Icon';
import useSharedRef from '../../utils/useSharedRef';

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

function copyTextToClipboard(text: string) {
  const element = document.createElement('textarea');
  element.value = text;
  element.setAttribute('aria-hidden', 'true');
  document.body.appendChild(element);

  element.select();

  let copied;
  try {
    copied = document.execCommand('copy');
  } catch (ex) {
    copied = false;
  }

  element.remove();

  return copied;
}

const NOTIFICATION_TIMEOUT_MS = 2000;

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
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

    return (
      <>
        <Button
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
        >
          {notificationLabel}
        </Tooltip>
        <Offscreen role="region" aria-live="polite">
          {copied ? notificationLabel : null}
        </Offscreen>
      </>
    );
  }
);

CopyButton.displayName = 'CopyButton';

export default CopyButton;

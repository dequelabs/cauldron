import React, { useRef, useEffect, useState } from 'react';
import { IconButton, Toast } from '@deque/cauldron-react';

interface CopyToClipboardButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  label?: string;
  value: string;
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

export default function CopyToClipboardButton({
  value,
  label = 'copy to clipboard',
  ...props
}: CopyToClipboardButtonProps) {
  const ref = useRef<HTMLButtonElement>();
  const [accessibleName, setAccessibleName] = useState(label);
  const [showToast, setShowToast] = useState(false);
  const handleClick = () => {
    copyTextToClipboard(value);
    setShowToast(true);
  };

  const handleDismiss = () => {
    setShowToast(false);
    ref.current?.focus();
  };

  useEffect(() => {
    // We don't know what context this button will be included in, so providing
    // a minimal accessible name of "example, x of y"
    const elements = Array.from(
      document.querySelectorAll('[data-copy-example]')
    );
    const index = elements.findIndex(element => element === ref.current);
    if (index !== -1 && elements.length) {
      setAccessibleName(`${label} example, ${index + 1} of ${elements.length}`);
    }
  });

  return (
    <>
      <IconButton
        data-copy-example
        aria-label={accessibleName}
        ref={ref}
        icon="copy"
        onClick={handleClick}
        label={accessibleName}
      />
      <Toast show={showToast} type="info" onDismiss={handleDismiss}>
        Example copied to clipboard!
      </Toast>
    </>
  );
}

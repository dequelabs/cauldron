import React, { useRef, useEffect, useState, useMemo } from 'react';
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

// Note: eventually we want to natively handle multiple toasts, but for now we will limit the copy toast notification
// to only display a single notification to prevent weird focus issues
const notificationsMap = new Map<Symbol, React.ComponentProps<Toast>>();
function CopyNotificationToast(
  props: React.ComponentProps<Toast>
): JSX.Element {
  const { show, onDismiss } = props;
  const id = useMemo(() => Symbol('toast'), []);
  const [deferredShow, setDeferredShow] = useState(false);

  useEffect(() => {
    if (show) {
      Array.from(notificationsMap.values()).forEach(({ onDismiss }) => {
        // force any open toasts to dismiss themselves
        onDismiss();
      });
      notificationsMap.set(id, props);
      // toast sets show via set timeout, so this matches the behavior to avoid a race condition
      setTimeout(() => setDeferredShow(show));
    } else {
      notificationsMap.delete(id);
      setDeferredShow(false);
    }

    return () => {
      notificationsMap.delete(id);
    };
  }, [show]);

  return <Toast {...props} show={deferredShow} />;
}

export default function CopyToClipboardButton({
  value,
  label = 'copy to clipboard',
  ...props
}: CopyToClipboardButtonProps) {
  const ref = useRef<HTMLButtonElement>();
  const toastRef = useRef<HTMLDivElement>();
  const [accessibleName, setAccessibleName] = useState(label);
  const [showToast, setShowToast] = useState(false);
  const handleClick = () => {
    copyTextToClipboard(value);
    setShowToast(true);
    toastRef.current?.focus();
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
    const index = elements.findIndex((element) => element === ref.current);
    if (index !== -1 && elements.length) {
      setAccessibleName(`${label}, ${index + 1} of ${elements.length}`);
    }
  }, [value]);

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
      <CopyNotificationToast
        toastRef={toastRef}
        show={showToast}
        type="info"
        onDismiss={handleDismiss}
      >
        Example copied to clipboard!
      </CopyNotificationToast>
    </>
  );
}

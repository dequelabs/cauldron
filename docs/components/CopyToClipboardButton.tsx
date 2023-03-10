import React from 'react';
import { IconButton } from '@deque/cauldron-react';

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
  const handleClick = () => {
    copyTextToClipboard(value);
  };
  return (
    <IconButton icon="copy" label={label} onClick={handleClick} {...props} />
  );
}

export default async function copyTextToClipboard(
  text: string
): Promise<boolean> {
  let copied = false;

  if ('clipboard' in navigator) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (ex) {
      // fallback to execCommand
    }
  } else {
    const element = document.createElement('span');
    element.textContent = text;
    element.setAttribute('aria-hidden', 'true');
    element.style.position = 'absolute';
    element.style.height = '1px';
    element.style.width = '1px';
    element.style.overflow = 'hidden';
    element.style.clip = 'rect(1px, 1px, 1px, 1px)';
    element.style.marginTop = '-1px';
    element.style.webkitUserSelect = 'text';
    element.style.userSelect = 'text';
    document.body.appendChild(element);

    const range = document.createRange();
    const selection = document.getSelection();
    range.selectNodeContents(element);
    selection?.addRange(range);

    try {
      document.execCommand('copy');
      copied = true;
    } catch (ex) {
      // no fallback
    }

    element.remove();
  }

  return copied;
}

export default function clickLink(target: HTMLElement, item?: HTMLElement) {
  item = item || target;
  const link = target.tagName !== 'A' && item.querySelector('a');
  if (!link) {
    return;
  }

  link.click();
}

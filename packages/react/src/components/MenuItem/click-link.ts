export default function clickLink(target: HTMLElement, item: HTMLElement) {
  const link = target.tagName !== 'A' && item.querySelector('a');
  if (!link) {
    return;
  }

  link.click();
}

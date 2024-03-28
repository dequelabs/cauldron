import type { Page, Locator } from '@playwright/test';
import path from 'path';

export async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate(
    (theme: string) => {
      const themes: Record<string, string> = {
        light: 'cauldron--theme-light',
        dark: 'cauldron--theme-dark'
      };

      Object.keys(themes).forEach((key) => {
        document.body.classList.remove(themes[key]);
      });
      document.body.classList.add(themes[theme]);
    },
    [theme]
  );
}

export async function setActive(locator: Locator) {
  const elementHandle = await locator.elementHandle();
  const page = elementHandle._parent._page;
  const session = await page.context().newCDPSession(page);

  // Generate a very specific unique css selector for this element
  const selector = await elementHandle.evaluate((target: Element) => {
    const path = [];
    let parent: Element | null;
    while ((parent = target.parentElement)) {
      path.unshift(
        `${target.tagName}:nth-child(${
          Array.from(target.parentElement?.children).indexOf(target) + 1
        })`
      );
      target = target.parentElement;
    }

    return path.join(' > ').toLowerCase();
  });

  await session.send('DOM.enable');
  const document = await session.send('DOM.getDocument');
  const nodeId = (
    await session.send('DOM.querySelector', {
      nodeId: document.root.nodeId,
      selector
    })
  ).nodeId;

  await session.send('CSS.enable');
  await session.send('CSS.forcePseudoState', {
    nodeId,
    forcedPseudoClasses: ['active']
  });
}

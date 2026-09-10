import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
  ModalCloseButton,
  ModalHeading
} from '../../../';
import LongContent from '../../utils/createLongContent';

const VIEWPORTS = {
  MOBILE_SMALL: { width: 319, height: 667 },
  MOBILE_MEDIUM: { width: 375, height: 667 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP: { width: 1280, height: 720 }
};

test('should have screenshot for Modal with small content', async ({
  mount,
  page
}) => {
  await mount(
    <Modal show>
      <ModalHeader>
        <ModalHeading>Modal Title</ModalHeading>
        <ModalCloseButton />
      </ModalHeader>
      <ModalContent>
        <p>This is some modal content.</p>
      </ModalContent>
      <ModalFooter>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </ModalFooter>
    </Modal>
  );

  const dialog = page.getByRole('dialog');

  await expect(dialog).toHaveScreenshot('modal-small-content');
  await setTheme(page, 'dark');
  await expect(dialog).toHaveScreenshot('dark--modal-small-content');
});

test('should have screenshot for scrollable Modal with large content on large viewports', async ({
  mount,
  page
}) => {
  await page.setViewportSize(VIEWPORTS.DESKTOP);

  await mount(
    <Modal show scrollable>
      <ModalHeader>
        <ModalHeading>Modal With Large Content - Large Viewport</ModalHeading>
        <ModalCloseButton />
      </ModalHeader>
      <ModalContent>
        <LongContent />
      </ModalContent>
      <ModalFooter>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </ModalFooter>
    </Modal>
  );

  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveScreenshot('modal-large-content-large-viewport');
  await setTheme(page, 'dark');
  await expect(dialog).toHaveScreenshot(
    'dark--modal-large-content-large-viewport'
  );
});

test('should have screenshot for scrollable Modal with large content on small viewports - below breakpoint', async ({
  mount,
  page
}) => {
  await page.setViewportSize(VIEWPORTS.MOBILE_SMALL);

  await mount(
    <Modal show scrollable>
      <ModalHeader>
        <ModalHeading>Modal With Large Content - Small Viewport</ModalHeading>
        <ModalCloseButton />
      </ModalHeader>
      <ModalContent>
        <LongContent />
      </ModalContent>
      <ModalFooter>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </ModalFooter>
    </Modal>
  );

  const header = page.getByRole('heading', {
    name: 'Modal with Large Content'
  });
  await expect(header).toBeVisible();

  const cancelButton = page.getByRole('button', { name: 'Cancel' });
  const confirmButton = page.getByRole('button', { name: 'Confirm' });
  await expect(cancelButton).toBeVisible();
  await expect(confirmButton).toBeVisible();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveScreenshot('modal-large-content-small-viewport');
  await setTheme(page, 'dark');
  await expect(dialog).toHaveScreenshot(
    'dark--modal-large-content-small-viewport'
  );
});

test('should have screenshot for scrollable Modal with large content on medium viewports', async ({
  mount,
  page
}) => {
  await page.setViewportSize(VIEWPORTS.MOBILE_MEDIUM);

  await mount(
    <Modal show scrollable>
      <ModalHeader>
        <ModalHeading>Modal With Large Content - Medium Viewport</ModalHeading>
        <ModalCloseButton />
      </ModalHeader>
      <ModalContent>
        <LongContent />
      </ModalContent>
      <ModalFooter>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </ModalFooter>
    </Modal>
  );

  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveScreenshot('modal-large-content-medium-viewport');
  await setTheme(page, 'dark');
  await expect(dialog).toHaveScreenshot(
    'dark--modal-large-content-medium-viewport'
  );
});

test('scrollable Modal content is keyboard-accessible', async ({
  mount,
  page
}) => {
  await page.setViewportSize(VIEWPORTS.DESKTOP);

  await mount(
    <Modal show scrollable>
      <ModalHeader>
        <ModalHeading>Scrollable Modal</ModalHeading>
        <ModalCloseButton />
      </ModalHeader>
      <ModalContent>
        <LongContent />
      </ModalContent>
      <ModalFooter>
        <Button variant="primary">Confirm</Button>
      </ModalFooter>
    </Modal>
  );

  const content = page.locator('.Dialog__content');
  await expect(content).toBeVisible();
  // The premise for the rest of this test: the region has to actually
  // overflow, and it holds no focusable children of its own.
  await expect
    .poll(async () =>
      content.evaluate((el) => el.scrollHeight - el.clientHeight)
    )
    .toBeGreaterThan(0);

  // Dialog moves focus to the heading asynchronously once it opens.
  await expect(page.locator('.Dialog__heading')).toBeFocused();

  // WCAG 2.1.1 requires the region to be reachable by keyboard, not merely
  // focusable by script: tabindex="-1" satisfies a .focus() call while
  // leaving a keyboard user unable to reach the region at all.
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(content).toBeFocused();

  // Once focused, scrolling is the browser's native default action.
  await content.press('PageDown');
  await expect
    .poll(async () => content.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0);
});

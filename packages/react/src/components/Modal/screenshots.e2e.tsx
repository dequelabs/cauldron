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

test('should have screenshot for Modal with large content on large viewports with scrollable content', async ({
  mount,
  page
}) => {
  await page.setViewportSize(VIEWPORTS.DESKTOP);

  await mount(
    <Modal show>
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

test('should have screenshot for Modal with large content on small viewports - no scrollable content', async ({
  mount,
  page
}) => {
  await page.setViewportSize(VIEWPORTS.MOBILE_SMALL);

  await mount(
    <Modal show>
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

test('should have screenshot for Modal with scrollable content on medium viewports', async ({
  mount,
  page
}) => {
  await page.setViewportSize(VIEWPORTS.MOBILE_MEDIUM);

  await mount(
    <Modal show>
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

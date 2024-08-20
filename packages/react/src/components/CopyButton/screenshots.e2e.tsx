import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { CopyButton } from '../../../';

test('should have screenshot for CopyButton', async ({ mount, page }) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the copy button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <CopyButton value="">Resting</CopyButton>
      <CopyButton value="">Hover</CopyButton>
      <CopyButton value="">Active</CopyButton>
      <CopyButton value="">Focus</CopyButton>
      <CopyButton value="" disabled>
        Disabled
      </CopyButton>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component
    .getByText('Active')
    .press('Space', { delay: 1000, noWaitAfter: true });
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('copybutton');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--copybutton');
});

test('should have screenshot for CopyButton[thin]', async ({ mount, page }) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the copy button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <CopyButton value="" thin>
        Resting
      </CopyButton>
      <CopyButton value="" thin>
        Hover
      </CopyButton>
      <CopyButton value="" thin>
        Active
      </CopyButton>
      <CopyButton value="" thin>
        Focus
      </CopyButton>
      <CopyButton value="" thin disabled>
        Disabled
      </CopyButton>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component
    .getByText('Active')
    .press('Space', { delay: 1000, noWaitAfter: true });
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('copybutton[thin]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--copybutton[thin]');
});

test('should have screenshot for CopyButton[condensed]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the copy button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <CopyButton value="" hideVisibleLabel>
        Resting
      </CopyButton>
      <CopyButton value="" hideVisibleLabel>
        Hover
      </CopyButton>
      <CopyButton value="" hideVisibleLabel>
        Active
      </CopyButton>
      <CopyButton value="" hideVisibleLabel>
        Focus
      </CopyButton>
      <CopyButton value="" hideVisibleLabel disabled>
        Disabled
      </CopyButton>
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByRole('button', { name: 'Active' }));
  await component
    .getByRole('button', { name: 'Active' })
    .press('Space', { delay: 1000, noWaitAfter: true });
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot('copybutton[condensed]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--copybutton[condensed]');
});

test('should have screenshot for CopyButton[condensed,thin]', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // we don't want to capture the visibility of tooltips here, just the copy button itself
    content: `.Tooltip { visibility: hidden !important }`
  });
  const component = await mount(
    <div>
      <CopyButton value="" hideVisibleLabel thin>
        Resting
      </CopyButton>
      <CopyButton value="" hideVisibleLabel thin>
        Hover
      </CopyButton>
      <CopyButton value="" hideVisibleLabel thin>
        Active
      </CopyButton>
      <CopyButton value="" hideVisibleLabel thin>
        Focus
      </CopyButton>
      <CopyButton value="" hideVisibleLabel thin disabled>
        Disabled
      </CopyButton>
    </div>
  );

  await component.getByRole('button', { name: 'Hover' }).hover();
  setActive(await component.getByRole('button', { name: 'Active' }));
  await component
    .getByRole('button', { name: 'Active' })
    .press('Space', { delay: 1000, noWaitAfter: true });
  await component.getByRole('button', { name: 'Focus' }).focus();

  await expect(component).toHaveScreenshot('copybutton[condensed,thin]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--copybutton[condensed,thin]');
});
